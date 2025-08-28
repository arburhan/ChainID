import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Lazy-load ABI files
let _IDENTITY_ABI: any = null;
let _CREDENTIALS_ABI: any = null;
let _ACCESS_CONTROL_ABI: any = null;
let _AUDIT_CONTROL_ABI: any = null;
let _MOCK_VERIFIER_ABI: any = null;

function loadABI(contractName: string) {
  const candidates = [
    path.join(__dirname, '..', '..', 'abi', `${contractName}.json`), // backend/abi
    path.join(__dirname, '..', 'abi', `${contractName}.json`)        // backend/src/abi (legacy)
  ];
  for (const abiPath of candidates) {
    try {
      const abiData = fs.readFileSync(abiPath, 'utf8');
      const parsed = JSON.parse(abiData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.abi)) {
        return parsed.abi;
      }
      throw new Error('Invalid ABI format');
    } catch (_e) {
      // try next candidate
    }
  }
  console.error(`Error loading ABI for ${contractName}: tried paths ->`, candidates);
  throw new Error(`Failed to load ABI for ${contractName}`);
}

function getABI(contractName: string) {
  switch (contractName) {
    case 'identity':
      if (!_IDENTITY_ABI) _IDENTITY_ABI = loadABI('identity');
      return _IDENTITY_ABI;
    case 'credentialsCntract':
      if (!_CREDENTIALS_ABI) _CREDENTIALS_ABI = loadABI('credentialsCntract');
      return _CREDENTIALS_ABI;
    case 'accessControl':
      if (!_ACCESS_CONTROL_ABI) _ACCESS_CONTROL_ABI = loadABI('accessControl');
      return _ACCESS_CONTROL_ABI;
    case 'auditControl':
      if (!_AUDIT_CONTROL_ABI) _AUDIT_CONTROL_ABI = loadABI('auditControl');
      return _AUDIT_CONTROL_ABI;
    case 'mockVerifier':
      if (!_MOCK_VERIFIER_ABI) _MOCK_VERIFIER_ABI = loadABI('mockVerifier');
      return _MOCK_VERIFIER_ABI;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }
}

export class ContractService {
  async isWalletAddress(address: string): Promise<boolean> {
    const code = await this.provider.getCode(address);
    return code === "0x";
  }
  async getWalletAddress(): Promise<string> {
    return this.signer.address;
  }
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  // Contract instances
  public identityContract?: ethers.Contract;
  public credentialContract?: ethers.Contract;
  public accessControlContract?: ethers.Contract;
  public auditContract?: ethers.Contract;
  public mockVerifierContract?: ethers.Contract;

  constructor() {
    // Initialize provider and signer
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;



    console.log('Environment check:');
    console.log('- SEPOLIA_RPC_URL:', rpcUrl || 'Not Set');
    console.log('- SEPOLIA_PRIVATE_KEY length:', privateKey ? privateKey.length : 0);
    console.log('- SEPOLIA_PRIVATE_KEY starts with 0x:', privateKey ? privateKey.startsWith('0x') : false);
    console.log('- Available env vars:', Object.keys(process.env).filter(key => key.includes('RPC') || key.includes('KEY') || key.includes('ADDRESS')));

    if (!rpcUrl) {
      throw new Error('SEPOLIA_RPC_URL environment variable is required');
    }

    if (!privateKey) {
      throw new Error('SEPOLIA_PRIVATE_KEY environment variable is required. Please set it in your environment or create a .env file.');
    }

    // Normalize private key format (add 0x if missing)
    const normalizedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

    // Validate private key format
    if (normalizedPrivateKey.length !== 66) {
      throw new Error(`Invalid private key format. Expected 64 hex characters with 0x prefix, got length ${normalizedPrivateKey.length}. Current value: ${normalizedPrivateKey.substring(0, 10)}...`);
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(normalizedPrivateKey, this.provider);

    // Initialize contracts (addresses can come in two naming styles)
    const identityAddress = process.env.IDENTITY_CONTRACT || process.env.IDENTITY_CONTRACT_ADDRESS;
    const credentialAddress = process.env.CREDENTIAL_CONTRACT || process.env.CREDENTIAL_CONTRACT_ADDRESS;
    const accessControlAddress = process.env.ACCESS_CONTROL_CONTRACT || process.env.ACCESS_CONTROL_CONTRACT_ADDRESS;
    const auditAddress = process.env.AUDIT_CONTRACT || process.env.AUDIT_CONTRACT_ADDRESS;
    const mockVerifierAddress = process.env.MOCK_VERIFIER_ADDRESS; // single canonical name in deploy output

    const safeAddress = (addr?: string) => {
      if (!addr) return undefined;
      if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) throw new Error(`Invalid address format: ${addr}`);
      return ethers.getAddress(addr.toLowerCase());
    };

    const identityAddr = safeAddress(identityAddress);
    const credentialAddr = safeAddress(credentialAddress);
    const accessCtrlAddr = safeAddress(accessControlAddress);
    const auditAddr = safeAddress(auditAddress);
    const mockVerifierAddr = safeAddress(mockVerifierAddress);

    if (identityAddr) {
      this.identityContract = new ethers.Contract(identityAddr, getABI('identity'), this.signer);
    }
    if (credentialAddr) {
      this.credentialContract = new ethers.Contract(credentialAddr, getABI('credentialsCntract'), this.signer);
    }
    if (accessCtrlAddr) {
      this.accessControlContract = new ethers.Contract(accessCtrlAddr, getABI('accessControl'), this.signer);
    }
    if (auditAddr) {
      this.auditContract = new ethers.Contract(auditAddr, getABI('auditControl'), this.signer);
    }
    if (mockVerifierAddr) {
      this.mockVerifierContract = new ethers.Contract(mockVerifierAddr, getABI('mockVerifier'), this.signer);
    }
  }

  // Identity Contract Methods
  async registerDID(profileHash: string): Promise<any> {
    try {
      const tx = await this.identityContract.registerDID(profileHash);
      return await tx.wait();
    } catch (error) {
      console.error('Error registering DID:', error);
      throw error;
    }
  }

  async addIssuer(account: string): Promise<any> {
    try {
      // Validate and checksum the address; tolerate bad checksum by normalizing case
      let checksummedAddress: string;
      try {
        checksummedAddress = ethers.getAddress(account);
      } catch (err: any) {
        if (typeof account === 'string' && /^0x[0-9a-fA-F]{40}$/.test(account)) {
          checksummedAddress = ethers.getAddress(account.toLowerCase());
        } else {
          throw err;
        }
      }
      if (!this.identityContract) throw new Error('IDENTITY_CONTRACT(_ADDRESS) is not set');
      const tx = await this.identityContract.addIssuer(checksummedAddress);
      return await tx.wait();
    } catch (error) {
      console.error('Error adding issuer:', error);
      throw error;
    }
  }

  async addIssuerOnCredentialIdentity(account: string): Promise<any> {
    try {
      if (!this.credentialContract) throw new Error('CREDENTIAL_CONTRACT(_ADDRESS) is not set');
      // Discover the exact Identity address used by the credential contract
      const identityAddr: string = await this.credentialContract.identity();
      const identityAbi = getABI('identity');
      const identity = new ethers.Contract(ethers.getAddress(identityAddr), identityAbi, this.signer);

      let checksummedAddress: string;
      try {
        checksummedAddress = ethers.getAddress(account);
      } catch {
        checksummedAddress = ethers.getAddress(account.toLowerCase());
      }

      const tx = await identity.addIssuer(checksummedAddress);
      return await tx.wait();
    } catch (error) {
      console.error('Error adding issuer on credential.identity:', error);
      throw error;
    }
  }

  async isRegistered(user: string): Promise<boolean> {
    try {
      // Validate and checksum the address
      const checksummedAddress = ethers.getAddress(user);
      return await this.identityContract.isRegistered(checksummedAddress);
    } catch (error) {
      console.error('Error checking registration:', error);
      throw error;
    }
  }

  // Credential Contract Methods
  async issueCredential(to: string, credentialHash: string, uri: string): Promise<any> {
    try {
      if (!this.credentialContract) throw new Error('CREDENTIAL_CONTRACT(_ADDRESS) is not set');
      // Validate and checksum the address
      const checksummedAddress = ethers.getAddress(to);
      // Prevent safeMint to non-ERC721Receiver contracts (common cause of custom error)
      const codeAtRecipient = await this.provider.getCode(checksummedAddress);
      if (codeAtRecipient && codeAtRecipient !== '0x') {
        throw new Error('Recipient is a contract. Please use a wallet (EOA) address.');
      }
      const tx = await this.credentialContract.issue(checksummedAddress, credentialHash, uri);
      const receipt = await tx.wait();
      // Try to parse CredentialIssued event for tokenId
      const issuedLog = receipt.logs.find((log: any) => log.eventName === 'CredentialIssued');
      const tokenId = issuedLog?.args?.tokenId?.toString?.() ?? null;
      return { ...receipt, tokenId };
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  }

  async revokeCredential(tokenId: number): Promise<any> {
    try {
      if (!this.credentialContract) throw new Error('CREDENTIAL_CONTRACT(_ADDRESS) is not set');
      const tx = await this.credentialContract.revoke(tokenId);
      return await tx.wait();
    } catch (error) {
      console.error('Error revoking credential:', error);
      throw error;
    }
  }

  // Access Control Contract Methods
  async requestAccess(subject: string, purposeHash: string): Promise<string> {
    try {
      if (!this.accessControlContract) throw new Error('ACCESS_CONTROL_CONTRACT(_ADDRESS) is not set');
      // Validate and checksum the address
      const checksummedAddress = ethers.getAddress(subject);
      const tx = await this.accessControlContract.requestAccess(checksummedAddress, purposeHash);
      const receipt = await tx.wait();
      // Extract requestId from events
      const event = receipt.logs.find((log: any) => log.eventName === 'AccessRequested');
      return event?.args?.requestId || '';
    } catch (error) {
      console.error('Error requesting access:', error);
      throw error;
    }
  }

  async approveAccess(requestId: string, signature: string, proof?: string): Promise<any> {
    try {
      if (!this.accessControlContract) throw new Error('ACCESS_CONTROL_CONTRACT(_ADDRESS) is not set');
      const tx = await this.accessControlContract.approve(requestId, signature, proof || '0x');
      return await tx.wait();
    } catch (error) {
      console.error('Error approving access:', error);
      throw error;
    }
  }

  // Mock Verifier Contract Methods
  async verifyProof(proof: string, signalHash: string): Promise<boolean> {
    try {
      if (!this.mockVerifierContract) throw new Error('MOCK_VERIFIER_ADDRESS is not set');
      return await this.mockVerifierContract.verify(proof, signalHash);
    } catch (error) {
      console.error('Error verifying proof:', error);
      throw error;
    }
  }

  // Utility Methods
  async getContractAddresses() {
    return {
      identity: await this.identityContract.getAddress(),
      credential: await this.credentialContract.getAddress(),
      accessControl: await this.accessControlContract.getAddress(),
      audit: await this.auditContract.getAddress(),
      mockVerifier: await this.mockVerifierContract.getAddress()
    };
  }

  async getSignerAddress(): Promise<string> {
    return await this.signer.getAddress();
  }

  async getBalance(): Promise<string> {
    const balance = await this.provider.getBalance(await this.signer.getAddress());
    return ethers.formatEther(balance);
  }
}

export default ContractService;
