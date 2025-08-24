import { Router } from 'express';
import ContractService from '../services/contractService';

const router = Router();
const contractService = new ContractService();

// Get contract addresses
router.get('/addresses', async (req, res) => {
  try {
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

    const result = await contractService.registerDID(profileHash);
    res.json({ success: true, transaction: result });
  } catch (error) {
    console.error('Error registering DID:', error);
    res.status(500).json({ success: false, error: 'Failed to register DID' });
  }
});

router.post('/identity/add-issuer', async (req, res) => {
  try {
    const { account } = req.body;
    if (!account) {
      return res.status(400).json({ success: false, error: 'Account address is required' });
    }

    const result = await contractService.addIssuer(account);
    res.json({ success: true, transaction: result });
  } catch (error) {
    console.error('Error adding issuer:', error);
    res.status(500).json({ success: false, error: 'Failed to add issuer' });
  }
});

router.get('/identity/registered/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const isRegistered = await contractService.isRegistered(user);
    res.json({ success: true, isRegistered });
  } catch (error) {
    console.error('Error checking registration:', error);
    res.status(500).json({ success: false, error: 'Failed to check registration' });
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

    const result = await contractService.issueCredential(to, credentialHash, uri);
    res.json({ success: true, transaction: result });
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).json({ success: false, error: 'Failed to issue credential' });
  }
});

router.post('/credential/revoke', async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) {
      return res.status(400).json({ success: false, error: 'Token ID is required' });
    }

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

    const requestId = await contractService.requestAccess(subject, purposeHash);
    res.json({ success: true, requestId });
  } catch (error) {
    console.error('Error requesting access:', error);
    res.status(500).json({ success: false, error: 'Failed to request access' });
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

    const isValid = await contractService.verifyProof(proof, signalHash);
    res.json({ success: true, isValid });
  } catch (error) {
    console.error('Error verifying proof:', error);
    res.status(500).json({ success: false, error: 'Failed to verify proof' });
  }
});

export default router;
