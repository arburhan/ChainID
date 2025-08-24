import { ethers } from 'ethers';

// Contract ABIs - Import from the local abi folder
import identityABI from '../abi/identity.json';
import credentialsABI from '../abi/credentialsCntract.json';
import accessControlABI from '../abi/accessControl.json';
import auditControlABI from '../abi/auditControl.json';
import mockVerifierABI from '../abi/mockVerifier.json';

// Contract addresses (will be loaded from environment or API)
export const CONTRACT_ADDRESSES = {
  IDENTITY: import.meta.env.VITE_IDENTITY_CONTRACT_ADDRESS || '',
  CREDENTIAL: import.meta.env.VITE_CREDENTIAL_CONTRACT_ADDRESS || '',
  ACCESS_CONTROL: import.meta.env.VITE_ACCESS_CONTROL_CONTRACT_ADDRESS || '',
  AUDIT: import.meta.env.VITE_AUDIT_CONTRACT_ADDRESS || '',
  MOCK_VERIFIER: import.meta.env.VITE_MOCK_VERIFIER_ADDRESS || ''
};

// Contract ABIs
export const CONTRACT_ABIS = {
  IDENTITY: identityABI,
  CREDENTIAL: credentialsABI,
  ACCESS_CONTROL: accessControlABI,
  AUDIT: auditControlABI,
  MOCK_VERIFIER: mockVerifierABI
};

// Network configuration
export const NETWORK_CONFIG = {
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  }
};

// Contract factory functions
export const createContractInstance = (
  address: string,
  abi: any,
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};

// Contract instances factory
export const createContractInstances = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return {
    identity: createContractInstance(CONTRACT_ADDRESSES.IDENTITY, CONTRACT_ABIS.IDENTITY, signerOrProvider),
    credential: createContractInstance(CONTRACT_ADDRESSES.CREDENTIAL, CONTRACT_ABIS.CREDENTIAL, signerOrProvider),
    accessControl: createContractInstance(CONTRACT_ADDRESSES.ACCESS_CONTROL, CONTRACT_ABIS.ACCESS_CONTROL, signerOrProvider),
    audit: createContractInstance(CONTRACT_ADDRESSES.AUDIT, CONTRACT_ABIS.AUDIT, signerOrProvider),
    mockVerifier: createContractInstance(CONTRACT_ADDRESSES.MOCK_VERIFIER, CONTRACT_ABIS.MOCK_VERIFIER, signerOrProvider)
  };
};

// Contract interaction functions
export const contractInteractions = {
  // Identity Contract
  async registerDID(contract: ethers.Contract, profileHash: string, signer: ethers.Signer) {
    try {
      const tx = await (contract as any).connect(signer).registerDID(profileHash);
      return await tx.wait();
    } catch (error) {
      console.error('Error registering DID:', error);
      throw error;
    }
  },

  async addIssuer(contract: ethers.Contract, account: string, signer: ethers.Signer) {
    try {
      const tx = await (contract as any).connect(signer).addIssuer(account);
      return await tx.wait();
    } catch (error) {
      console.error('Error adding issuer:', error);
      throw error;
    }
  },

  async isRegistered(contract: ethers.Contract, user: string) {
    try {
      return await (contract as any).isRegistered(user);
    } catch (error) {
      console.error('Error checking registration:', error);
      throw error;
    }
  },

  // Credential Contract
  async issueCredential(contract: ethers.Contract, to: string, credentialHash: string, uri: string, signer: ethers.Signer) {
    try {
      const tx = await (contract as any).connect(signer).issue(to, credentialHash, uri);
      return await tx.wait();
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  },

  async revokeCredential(contract: ethers.Contract, tokenId: number, signer: ethers.Signer) {
    try {
      const tx = await (contract as any).connect(signer).revoke(tokenId);
      return await tx.wait();
    } catch (error) {
      console.error('Error revoking credential:', error);
      throw error;
    }
  },

  // Access Control Contract
  async requestAccess(contract: ethers.Contract, subject: string, purposeHash: string, signer: ethers.Signer) {
    try {
      const tx = await (contract as any).connect(signer).requestAccess(subject, purposeHash);
      const receipt = await tx.wait();
      // Extract requestId from events
      const event = receipt.logs.find((log: any) => log.eventName === 'AccessRequested');
      return event?.args?.requestId || '';
    } catch (error) {
      console.error('Error requesting access:', error);
      throw error;
    }
  },

  async approveAccess(contract: ethers.Contract, requestId: string, signature: string, proof: string, signer: ethers.Signer) {
    try {
      const tx = await (contract as any).connect(signer).approve(requestId, signature, proof || '0x');
      return await tx.wait();
    } catch (error) {
      console.error('Error approving access:', error);
      throw error;
    }
  },

  // Mock Verifier
  async verifyProof(contract: ethers.Contract, proof: string, signalHash: string) {
    try {
      return await (contract as any).verify(proof, signalHash);
    } catch (error) {
      console.error('Error verifying proof:', error);
      throw error;
    }
  }
};

// Utility functions
export const utils = {
  // Convert string to bytes32 hash
  stringToBytes32: (str: string): string => {
    return ethers.keccak256(ethers.toUtf8Bytes(str));
  },

  // Generate random bytes32 hash
  randomBytes32: (): string => {
    return ethers.hexlify(ethers.randomBytes(32));
  },

  // Format address
  formatAddress: (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Validate Ethereum address
  isValidAddress: (address: string): boolean => {
    return ethers.isAddress(address);
  }
};

export default {
  CONTRACT_ADDRESSES,
  CONTRACT_ABIS,
  NETWORK_CONFIG,
  createContractInstances,
  contractInteractions,
  utils
};
