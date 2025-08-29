import { Router } from 'express';
import ContractService from '../services/contractService';

const router = Router();
let contractService: ContractService;

// Initialize contract service lazily
function getContractService() {
  if (!contractService) {
    contractService = new ContractService();
  }
  return contractService;
}

// Get contract addresses
router.get('/addresses', async (req, res) => {
  try {
    const contractService = getContractService();
    const addresses = await contractService.getContractAddresses();
    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Error getting contract addresses:', error);
    res.status(500).json({ success: false, error: 'Failed to get contract addresses' });
  }
});

// Get signer info
router.get('/signer', async (req, res) => {
  try {
    const contractService = getContractService();
    const address = await contractService.getSignerAddress();
    const balance = await contractService.getBalance();
    res.json({ success: true, address, balance });
  } catch (error) {
    console.error('Error getting signer info:', error);
    res.status(500).json({ success: false, error: 'Failed to get signer info' });
  }
});

// Identity Contract Routes
router.post('/identity/register', async (req, res) => {
  try {
    const { profileHash } = req.body;
    if (!profileHash) {
      return res.status(400).json({ success: false, error: 'Profile hash is required' });
    }

    const contractService = getContractService();
    const result = await contractService.registerDID(profileHash);
    res.json({ success: true, transaction: result });
  } catch (error) {
    console.error('Error registering DID:', error);
    res.status(500).json({ success: false, error: 'Failed to register DID' });
  }
});

router.post('/identity/add-issuer', async (req, res) => {
  try {
    const contractService = getContractService();
    // Always grant issuer to the backend signer address to avoid client checksum/casing issues
    const signerAddr = await contractService.getSignerAddress();
    // Grant on the Identity used by the Credential contract to match the issuer check
    const result = await contractService.addIssuerOnCredentialIdentity(signerAddr);
    res.json({ success: true, transaction: result });
  } catch (error: any) {
    console.error('Error adding issuer:', error);
    if (error.message.includes('bad address checksum') || error.message.includes('Invalid Ethereum address')) {
      res.status(400).json({ success: false, error: 'Invalid Ethereum address format' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to add issuer' });
    }
  }
});

router.get('/identity/registered/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const contractService = getContractService();
    const isRegistered = await contractService.isRegistered(user);
    res.json({ success: true, isRegistered });
  } catch (error: any) {
    console.error('Error checking registration:', error);
    if (error.message.includes('bad address checksum') || error.message.includes('Invalid Ethereum address')) {
      res.status(400).json({ success: false, error: 'Invalid Ethereum address format' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to check registration' });
    }
  }
});

// Credential Contract Routes
router.post('/credential/issue', async (req, res) => {
  try {
    const { to, credentialHash, uri } = req.body;
    if (!to || !credentialHash || !uri) {
      return res.status(400).json({ 
        success: false, 
        error: 'To address, credential hash, and URI are required' 
      });
    }

    const contractService = getContractService();
    const result = await contractService.issueCredential(to, credentialHash, uri);
    const makeJsonSafe = (obj: any) => JSON.parse(JSON.stringify(obj, (_k, v) => typeof v === 'bigint' ? v.toString() : v));
    const safeTx = makeJsonSafe(result);
    try {
      const { CredentialModel } = await import('../models/Credential');
      await CredentialModel.create({
        tokenId: (result as any)?.tokenId ?? '',
        to,
        credentialHash,
        uri,
        txHash: (result as any)?.hash ?? (result as any)?.transactionHash ?? ''
      });
    } catch (e) {
      console.error('Failed to persist credential:', e);
    }
    res.json({ success: true, transaction: safeTx });
  } catch (error: any) {
    console.error('Error issuing credential:', error);
    if (error.message.includes('bad address checksum') || error.message.includes('Invalid Ethereum address')) {
      res.status(400).json({ success: false, error: 'Invalid Ethereum address format' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to issue credential' });
    }
  }
});

router.post('/credential/revoke', async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) {
      return res.status(400).json({ success: false, error: 'Token ID is required' });
    }

    const contractService = getContractService();
    const result = await contractService.revokeCredential(tokenId);
    res.json({ success: true, transaction: result });
  } catch (error) {
    console.error('Error revoking credential:', error);
    res.status(500).json({ success: false, error: 'Failed to revoke credential' });
  }
});

// Access Control Contract Routes
router.post('/access/request', async (req, res) => {
  try {
    const { subject, purposeHash } = req.body;
    if (!subject || !purposeHash) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject address and purpose hash are required' 
      });
    }

    const contractService = getContractService();
    const requestId = await contractService.requestAccess(subject, purposeHash);
    res.json({ success: true, requestId });
  } catch (error: any) {
    console.error('Error requesting access:', error);
    if (error.message.includes('bad address checksum') || error.message.includes('Invalid Ethereum address')) {
      res.status(400).json({ success: false, error: 'Invalid Ethereum address format' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to request access' });
    }
  }
});

router.post('/access/approve', async (req, res) => {
  try {
    const { requestId, signature, proof } = req.body;
    if (!requestId || !signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Request ID and signature are required' 
      });
    }

    const contractService = getContractService();
    const result = await contractService.approveAccess(requestId, signature, proof);
    res.json({ success: true, transaction: result });
  } catch (error) {
    console.error('Error approving access:', error);
    res.status(500).json({ success: false, error: 'Failed to approve access' });
  }
});

// Mock Verifier Routes
router.post('/verifier/verify', async (req, res) => {
  try {
    const { proof, signalHash } = req.body;
    if (!proof || !signalHash) {
      return res.status(400).json({ 
        success: false, 
        error: 'Proof and signal hash are required' 
      });
    }

    const contractService = getContractService();
    const isValid = await contractService.verifyProof(proof, signalHash);
    res.json({ success: true, isValid });
  } catch (error) {
    console.error('Error verifying proof:', error);
    res.status(500).json({ success: false, error: 'Failed to verify proof' });
  }
});

export default router;
