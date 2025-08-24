import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI files - path should be relative to backend root
const loadABI = (contractName: string) => {
  const abiPath = path.join(__dirname, '..', '..', 'contracts', 'abi', `${contractName}.json`);
  try {
    const abiData = fs.readFileSync(abiPath, 'utf8');
    return JSON.parse(abiData);
  } catch (error) {
    console.error(`Error loading ABI for ${contractName}:`, error);
    throw new Error(`Failed to load ABI for ${contractName}`);
  }
};

// Contract ABIs
const IDENTITY_ABI = loadABI('identity');
const CREDENTIALS_ABI = loadABI('credentialsCntract');
const ACCESS_CONTROL_ABI = loadABI('accessControl');
const AUDIT_CONTROL_ABI = loadABI('auditControl');
const MOCK_VERIFIER_ABI = loadABI('mockVerifier');

export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  
  // Contract instances
  public identityContract: ethers.Contract;
  public credentialContract: ethers.Contract;
  public accessControlContract: ethers.Contract;
  public auditContract: ethers.Contract;
  public mockVerifierContract: ethers.Contract;

  constructor() {
    // Initialize provider and signer
    const rpcUrl = process.env.NETWORK_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID';
    const privateKey = process.env.WALLET_PRIVATE_KEY || '';
    
    if (!privateKey) {
      throw new Error('WALLET_PRIVATE_KEY is required');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);

    // Initialize contracts
    const identityAddress = process.env.IDENTITY_CONTRACT_ADDRESS;
    const credentialAddress = process.env.CREDENTIAL_CONTRACT_ADDRESS;
    const accessControlAddress = process.env.ACCESS_CONTROL_CONTRACT_ADDRESS;
    const auditAddress = process.env.AUDIT_CONTRACT_ADDRESS;
    const mockVerifierAddress = process.env.MOCK_VERIFIER_ADDRESS;

    if (!identityAddress || !credentialAddress || !accessControlAddress || !auditAddress || !mockVerifierAddress) {
      throw new Error('All contract addresses are required in environment variables');
    }

    this.identityContract = new ethers.Contract(identityAddress, IDENTITY_ABI, this.signer);
    this.credentialContract = new ethers.Contract(credentialAddress, CREDENTIALS_ABI, this.signer);
    this.accessControlContract = new ethers.Contract(accessControlAddress, ACCESS_CONTROL_ABI, this.signer);
    this.auditContract = new ethers.Contract(auditAddress, AUDIT_CONTROL_ABI, this.signer);
    this.mockVerifierContract = new ethers.Contract(mockVerifierAddress, MOCK_VERIFIER_ABI, this.signer);
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
      const tx = await this.identityContract.addIssuer(account);
      return await tx.wait();
    } catch (error) {
      console.error('Error adding issuer:', error);
      throw error;
    }
  }

  async isRegistered(user: string): Promise<boolean> {
    try {
      return await this.identityContract.isRegistered(user);
    } catch (error) {
      console.error('Error checking registration:', error);
      throw error;
    }
  }

  // Credential Contract Methods
  async issueCredential(to: string, credentialHash: string, uri: string): Promise<any> {
    try {
      const tx = await this.credentialContract.issue(to, credentialHash, uri);
      return await tx.wait();
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  }

  async revokeCredential(tokenId: number): Promise<any> {
    try {
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
      const tx = await this.accessControlContract.requestAccess(subject, purposeHash);
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
