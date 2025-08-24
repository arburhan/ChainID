import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  createContractInstances, 
  contractInteractions, 
  utils,
  CONTRACT_ADDRESSES 
} from '../lib/contracts';

interface ContractState {
  contracts: any;
  signer: ethers.Signer | null;
  provider: ethers.Provider | null;
  isConnected: boolean;
  address: string;
  balance: string;
}

interface UseContractsReturn extends ContractState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  registerDID: (profileHash: string) => Promise<any>;
  addIssuer: (account: string) => Promise<any>;
  issueCredential: (to: string, credentialHash: string, uri: string) => Promise<any>;
  revokeCredential: (tokenId: number) => Promise<any>;
  requestAccess: (subject: string, purposeHash: string) => Promise<string>;
  approveAccess: (requestId: string, signature: string, proof?: string) => Promise<any>;
  verifyProof: (proof: string, signalHash: string) => Promise<boolean>;
  isRegistered: (user: string) => Promise<boolean>;
  formatAddress: (address: string) => string;
  isValidAddress: (address: string) => boolean;
  stringToBytes32: (str: string) => string;
  randomBytes32: () => string;
}

export const useContracts = (): UseContractsReturn => {
  const [state, setState] = useState<ContractState>({
    contracts: null,
    signer: null,
    provider: null,
    isConnected: false,
    address: '',
    balance: '0'
  });

  // Initialize provider
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      setState(prev => ({ ...prev, provider }));
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!state.provider) {
        throw new Error('No provider available');
      }

      // Request account access
      const accounts = await (state.provider as any).send('eth_requestAccounts', []);
      const signer = await (state.provider as any).getSigner();
      const address = await signer.getAddress();
      const balance = await state.provider.getBalance(address);

      // Create contract instances
      const contracts = createContractInstances(signer);

      setState(prev => ({
        ...prev,
        contracts,
        signer,
        isConnected: true,
        address,
        balance: ethers.formatEther(balance)
      }));

      console.log('Wallet connected:', address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }, [state.provider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setState(prev => ({
      ...prev,
      contracts: null,
      signer: null,
      isConnected: false,
      address: '',
      balance: '0'
    }));
  }, []);

  // Contract interaction methods
  const registerDID = useCallback(async (profileHash: string) => {
    if (!state.contracts?.identity || !state.signer) {
      throw new Error('Wallet not connected');
    }
    return await contractInteractions.registerDID(state.contracts.identity, profileHash, state.signer);
  }, [state.contracts, state.signer]);

  const addIssuer = useCallback(async (account: string) => {
    if (!state.contracts?.identity || !state.signer) {
      throw new Error('Wallet not connected');
    }
    return await contractInteractions.addIssuer(state.contracts.identity, account, state.signer);
  }, [state.contracts, state.signer]);

  const issueCredential = useCallback(async (to: string, credentialHash: string, uri: string) => {
    if (!state.contracts?.credential || !state.signer) {
      throw new Error('Wallet not connected');
    }
    return await contractInteractions.issueCredential(state.contracts.credential, to, credentialHash, uri, state.signer);
  }, [state.contracts, state.signer]);

  const revokeCredential = useCallback(async (tokenId: number) => {
    if (!state.contracts?.credential || !state.signer) {
      throw new Error('Wallet not connected');
    }
    return await contractInteractions.revokeCredential(state.contracts.credential, tokenId, state.signer);
  }, [state.contracts, state.signer]);

  const requestAccess = useCallback(async (subject: string, purposeHash: string) => {
    if (!state.contracts?.accessControl || !state.signer) {
      throw new Error('Wallet not connected');
    }
    return await contractInteractions.requestAccess(state.contracts.accessControl, subject, purposeHash, state.signer);
  }, [state.contracts, state.signer]);

  const approveAccess = useCallback(async (requestId: string, signature: string, proof?: string) => {
    if (!state.contracts?.accessControl || !state.signer) {
      throw new Error('Wallet not connected');
    }
    return await contractInteractions.approveAccess(state.contracts.accessControl, requestId, signature, proof || '0x', state.signer);
  }, [state.contracts, state.signer]);

  const verifyProof = useCallback(async (proof: string, signalHash: string) => {
    if (!state.contracts?.mockVerifier) {
      throw new Error('Verifier contract not available');
    }
    return await contractInteractions.verifyProof(state.contracts.mockVerifier, proof, signalHash);
  }, [state.contracts]);

  const isRegistered = useCallback(async (user: string) => {
    if (!state.contracts?.identity) {
      throw new Error('Identity contract not available');
    }
    return await contractInteractions.isRegistered(state.contracts.identity, user);
  }, [state.contracts]);

  // Utility methods
  const formatAddress = useCallback((address: string) => {
    return utils.formatAddress(address);
  }, []);

  const isValidAddress = useCallback((address: string) => {
    return utils.isValidAddress(address);
  }, []);

  const stringToBytes32 = useCallback((str: string) => {
    return utils.stringToBytes32(str);
  }, []);

  const randomBytes32 = useCallback(() => {
    return utils.randomBytes32();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (state.address !== accounts[0]) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [state.address, connectWallet, disconnectWallet]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    registerDID,
    addIssuer,
    issueCredential,
    revokeCredential,
    requestAccess,
    approveAccess,
    verifyProof,
    isRegistered,
    formatAddress,
    isValidAddress,
    stringToBytes32,
    randomBytes32
  };
};

export default useContracts;
