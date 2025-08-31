# IdentiChain – Decentralized Identity on Ethereum (Sepolia)

IdentiChain is a self-sovereign identity (SSI) platform enabling users to control their identity data, request/approve access, and share verifiable credentials. It adapts the provided whitepaper to Ethereum Sepolia testnet with a full stack: Solidity smart contracts, Node.js backend, and a React + Tailwind frontend.

## Features
- User-owned DIDs with hashes on-chain; sensitive data encrypted off-chain (MongoDB)
- Issuance and revocation of verifiable credentials (ERC-721 based)
- Access requests and user consents enforced via signatures and on-chain events
- Audit logging on-chain
- Optional zk-proof hook: pluggable verifier contract (mock included)
- IPFS-ready hooks for large files/proofs (optional)

## Tech Stack
- Contracts: Solidity, Hardhat, OpenZeppelin, Ethers.js
- Backend: Node.js, Express, MongoDB (AES-256-GCM encryption), Ethers.js
- Frontend: React (Vite) + Tailwind CSS, MetaMask integration
- Network: Ethereum Sepolia testnet

## Project Structure
```
/contracts      # Hardhat project (Solidity, deploy scripts)
/backend        # Node.js Express API server
/frontend       # React + Vite + Tailwind app
.env.example    # Environment template
```

## Prerequisites
- Node.js LTS (>=18)
- NPM or PNPM
- MongoDB instance (local or Atlas)
- Sepolia RPC (Infura/Alchemy) and a funded test wallet

## Environment Setup
Copy and edit environment variables:
```bash
cp .env.example .env
```

Root `.env` is used by scripts; subprojects also read it. Create `.env` files in `/backend` and `/frontend` if you prefer, or rely on root `.env`.

Required values:
- MONGO_URI=mongodb+srv://...
- SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<key>
- SEPOLIA_PRIVATE_KEY=0x...
- DEPLOYER_ADDRESS=0xYourEOA
- IPFS_GATEWAY=https://ipfs.io/ipfs/  # optional

## Install
```bash
cd contracts && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Contracts
Compile and deploy to Sepolia:
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```
This prints deployed addresses. Copy them into the backend `.env` and frontend `.env` (see below). The backend expects Hardhat artifacts at `contracts/artifacts/...`; run `npx hardhat compile` first.

### Contracts Overview
- IdentityContract: Registers DIDs, stores hashes, role-based issuer/government management
- CredentialContract (ERC721): Issues/revokes credentials, binds to DID
- AccessControlContract: Access requests, user consent via signature, optional zk-proof verifier hook
- AuditContract: Emits/records immutable logs
- MockVerifier: Simple on-chain verifier placeholder

## Backend
Environment (.env in `/backend` uses same variables and contract addresses):
```
PORT=4000
MONGO_URI=...
SEPOLIA_RPC_URL=...
SEPOLIA_PRIVATE_KEY=...
IDENTITY_CONTRACT=0x...
CREDENTIAL_CONTRACT=0x...
ACCESS_CONTROL_CONTRACT=0x...
AUDIT_CONTRACT=0x...
AES_SECRET_HEX=32-byte-hex-key
```

Run server:
```bash
cd backend
npm run dev
```

API (selected):
- POST /register
- POST /issueCredential
- POST /requestAccess
- POST /consent
- POST /verifyCredential

## Frontend
Environment (`/frontend/.env`):
```
VITE_SEPOLIA_RPC_URL=...
VITE_IDENTITY_CONTRACT=0x...
VITE_CREDENTIAL_CONTRACT=0x...
VITE_ACCESS_CONTROL_CONTRACT=0x...
VITE_AUDIT_CONTRACT=0x...
VITE_BACKEND_URL=http://localhost:4000
```
Run app:
```bash
cd frontend
npm run dev
```

## Sample Flow
1) User connects wallet, registers DID via backend → on-chain DID + off-chain encrypted profile
2) Issuer address issues ERC-721 credential to user’s DID
3) Verifier submits access request; user approves in wallet (signature) → backend relays to contract
4) Optional: submit zk-proof reference and verifier hook validates
5) Verifier reads selective disclosures from backend if consent exists; contract logs event; AuditContract records

## Security Notes
- Only hashes/metadata on-chain; sensitive data stays off-chain encrypted with AES-256-GCM
- Role-based access for issuers/government; multisig-ready owner
- Validate all signatures and normalize addresses
- Treat zk verifier as pluggable; replace MockVerifier with real Groth16 verifier when ready

## License
MIT
