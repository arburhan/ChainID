# 🏗️ ChainID Smart Contracts

This directory contains the smart contracts for the ChainID decentralized identity system.

## 📁 Contract Structure

- **`IdentityContract.sol`** - Core identity management and DID registration
- **`CredentialContract.sol`** - Credential issuance and management (ERC721)
- **`AccessControlContract.sol`** - Access control and permission management
- **`AuditContract.sol`** - Audit trail and logging system
- **`MockVerifier.sol`** - Test verifier for development

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Run Tests
```bash
npm test
```

### 4. Deploy Locally (for testing)
```bash
# Start local hardhat node
npm run node

# In another terminal, deploy contracts
npm run deploy:local
```

## 🌐 Deploy to Sepolia Testnet

### Prerequisites
1. **Sepolia RPC URL** - Get from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
2. **Sepolia Private Key** - Export from MetaMask (without 0x prefix)
3. **Sepolia Test ETH** - Get from [Sepolia Faucet](https://sepoliafaucet.com/)
4. **Etherscan API Key** - Get from [Etherscan](https://etherscan.io/)

### Setup Environment
Create a `.env` file in the `contracts` folder:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_64_character_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Deploy
```bash
npm run deploy:sepolia
```

## 🔧 Available Scripts

- `npm run compile` - Compile all contracts
- `npm run test` - Run test suite
- `npm run deploy:local` - Deploy to local hardhat network
- `npm run deploy:sepolia` - Deploy to Sepolia testnet
- `npm run node` - Start local hardhat node
- `npm run clean` - Clean build artifacts

## 📋 Contract Details

### IdentityContract
- Manages Decentralized Identifiers (DIDs)
- Handles issuer role management
- Stores encrypted profile hashes

### CredentialContract
- ERC721-based credential tokens
- Links to IdentityContract for issuer verification
- Supports credential revocation

### AccessControlContract
- Manages access requests and approvals
- Supports EIP-191 signature verification
- Optional ZK proof verification

### AuditContract
- Logs all system activities
- Provides audit trail for compliance

### MockVerifier
- Test implementation for ZK proof verification
- Used during development and testing

## 🧪 Testing

The test suite covers:
- Contract deployment
- Role management
- Access control functionality
- Basic contract interactions

Run tests with:
```bash
npm test
```

## 🔍 Verification

After deploying to Sepolia, verify your contracts:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## ⚠️ Security Notes

- **Never share your private key**
- **Keep .env file secure**
- **Test thoroughly on testnet before mainnet**
- **Review all contract interactions**

## 🆘 Troubleshooting

### Common Issues:

1. **Compilation Errors**
   - Ensure Solidity version compatibility
   - Check for missing dependencies

2. **Deployment Failures**
   - Verify environment variables
   - Check Sepolia ETH balance
   - Ensure RPC URL is correct

3. **Test Failures**
   - Run `npm run compile` first
   - Check for network issues

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

---

**For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
