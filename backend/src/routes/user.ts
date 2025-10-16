import express from 'express';
import { UserModel } from '../models/User';
import { emailService } from '../services/emailService';

const router = express.Router();

// Register user with email
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, email, name, phone } = req.body;
    
    if (!walletAddress || !email || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address, email, and name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ walletAddress }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this wallet address or email already exists' 
      });
    }

    // Create new user
    const user = await UserModel.create({
      walletAddress,
      email,
      name,
      phone: phone || undefined
    });

    res.json({ 
      success: true, 
      user: {
        walletAddress: user.walletAddress,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register user' 
    });
  }
});

// Get user by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const user = await UserModel.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        walletAddress: user.walletAddress,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
});

// Update user profile
router.put('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { email, name, phone } = req.body;
    
    const user = await UserModel.findOneAndUpdate(
      { walletAddress },
      { 
        ...(email && { email }),
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        walletAddress: user.walletAddress,
        email: user.email,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update user' 
    });
  }
});

// Get user's credentials
router.get('/:walletAddress/credentials', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const { CredentialModel } = await import('../models/Credential');
    const credentials = await CredentialModel.find({ to: walletAddress }).sort({ issuedAt: -1 });
    
    res.json({ 
      success: true, 
      credentials: credentials.map(cred => ({
        tokenId: cred.tokenId,
        to: cred.to,
        credentialHash: cred.credentialHash,
        uri: cred.uri,
        txHash: cred.txHash,
        issuedAt: cred.issuedAt
      }))
    });
  } catch (error: any) {
    console.error('Error fetching user credentials:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch credentials' 
    });
  }
});

// Get user's access requests
router.get('/:walletAddress/access-requests', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const { ConsentModel } = await import('../models/Consent');
    const requests = await ConsentModel.find({ 
      $or: [{ requester: walletAddress }, { subject: walletAddress }] 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      requests: requests.map(req => ({
        requestId: req.requestId,
        requester: req.requester,
        subject: req.subject,
        purposeHash: req.purposeHash,
        approved: req.approved,
        signature: req.signature,
        createdAt: req.createdAt
      }))
    });
  } catch (error: any) {
    console.error('Error fetching access requests:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch access requests' 
    });
  }
});

export default router;
