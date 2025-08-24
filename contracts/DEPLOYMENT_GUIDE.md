# 🚀 ChainID Smart Contract Deployment Guide

## 📋 Prerequisites

Before deploying, you need to collect the following information:

### 1. Sepolia RPC URL
Get a free RPC endpoint from one of these providers:
- [Alchemy](https://www.alchemy.com/) - Recommended
- [Infura](https://infura.io/)
- [QuickNode](https://www.quicknode.com/)

### 2. Sepolia Private Key
- Create a MetaMask wallet
- Switch to Sepolia testnet
- Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Export your private key (without 0x prefix)

### 3. Etherscan API Key
- Go to [Etherscan](https://etherscan.io/)
- Create an account and get your API key

## 🔧 Setup Steps

### Step 1: Create Environment File
Create a `.env` file in the `contracts` folder:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key_here_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Step 2: Install Dependencies
```bash
cd contracts
npm install
```

### Step 3: Compile Contracts
```bash
npm run compile
```

### Step 4: Deploy to Sepolia
```bash
npm run deploy:sepolia
```

## 📜 Contract Deployment Order

The deployment script will deploy contracts in this order:

1. **IdentityContract** - Core identity management
2. **CredentialContract** - Credential issuance and management
3. **AccessControlContract** - Access control and permissions
4. **AuditContract** - Audit trail and logging
5. **MockVerifier** - Test verifier for development

## 🔍 Verification

After deployment, verify your contracts on [Sepolia Etherscan](https://sepolia.etherscan.io/):

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## ⚠️ Important Notes

- **Never share your private key**
- **Sepolia is a testnet - no real ETH needed**
- **Keep your .env file secure and never commit it to git**
- **Test thoroughly on Sepolia before mainnet**

## 🆘 Troubleshooting

### Common Issues:

1. **Insufficient Sepolia ETH**
   - Get test ETH from faucet

2. **RPC URL Issues**
   - Check your RPC endpoint is correct
   - Ensure you have proper rate limits

3. **Private Key Format**
   - Remove 0x prefix if present
   - Ensure 64 characters (32 bytes)

4. **Compilation Errors**
   - Run `npm run compile` to check for errors
   - Ensure Solidity version compatibility

## 📞 Support

If you encounter issues:
1. Check the error messages carefully
2. Verify all environment variables are set correctly
3. Ensure you have sufficient test ETH
4. Check network connectivity

---

**Happy Deploying! 🎉**
