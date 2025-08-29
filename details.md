## ChainID – Feature Brief (for Presentation)

### 1) What this app does (high-level)
- Register an identity (name + national ID → encrypted → profileHash → on-chain DID)
- Issue on-chain verifiable credentials (ERC721 with metadata URI + credential hash)
- Request and approve consent for data access (subject-controlled)
- Verify (demo mock) using profileHash/txHash input

### 2) Page-by-page (inputs → outputs)

- Register page
  - Inputs: Full Name, National ID (plus connected wallet address)
  - Process: `{name,nid}` encrypted → `profileHash = sha256(encryptedJson)`; on-chain `registerDID(profileHash)`
  - Output (UI/JSON): `{ ok: true, txHash, profileHash }`

- Verify page
  - Input: `Profile Hash or Transaction Hash` (single text field; must be non-empty hex)
  - Process: frontend sends as `proof` and `signalHash` to mock verifier
  - Output: JSON result (valid/mock-success if non-empty)

- Dashboard – Issue Credential (Issuer)
  - Inputs: `Recipient Address (EOA)`, `Metadata URI (ipfs:// or https gateway)`, `Credential Payload (JSON)`
  - Process: `credentialHash = keccak256(utf8(URI))`; call `issue(to, credentialHash, uri)`
  - Output: success banner + transaction receipt; DB row saved `{ tokenId, to, credentialHash, uri, txHash }`

-- Dashboard – Request Access (Requester → Subject)
  - Inputs: `Subject Address`, `Purpose (JSON)`
  - Process: `purposeHash = keccak256(utf8(JSON))`; call `requestAccess(subject, purposeHash)`
  - Output: shows `requestId` (bytes32) + stores consent `{ approved: false }`

-- Dashboard – Approve Access (Subject)
  - Inputs: `Request ID (bytes32)`, `Signature` (auto “Sign with Wallet” or manual), `Optional Proof`
  - Guardrails: UI checks connected wallet == on-chain `subject`
  - Output: success receipt; consent updated `{ approved: true, signature }`

- Verify (Demo/mock)
  1. Input: Any non-empty hex (e.g., profileHash/txHash) in this mock setup.
  2. Backend calls `MockVerifier.verify(bytes proof, bytes32)` → returns `true` if proof non-empty.

### 3) Smart-contracts (essentials)
- `IdentityContract`
  - Roles: `ISSUER_ROLE`, `GOVERNMENT_ROLE`.
  - Admin can `addIssuer(address)`; Issuers can issue credentials via the credential contract.

- `CredentialContract` (ERC721)
  - `issue(address to, bytes32 credentialHash, string uri)`; requires `identity.hasRole(ISSUER_ROLE, msg.sender)`.
  - Emits `CredentialIssued(tokenId, to, credentialHash)`.

- `AccessControlContract`
  - `requestAccess(address subject, bytes32 purposeHash) → bytes32 requestId` (event: `AccessRequested`).
  - `approve(bytes32 requestId, bytes signature, bytes optionalProof)`; requires caller == subject and `ECDSA.recover(ethMsgHash(requestId)) == subject`.
  - Event: `AccessApproved`.

### 4) Database models (MongoDB)
- `consents`
  - Fields: `requestId` (unique), `requester`, `subject`, `purposeHash`, `approved`(bool), `signature?`, `createdAt`.
  - Created on request; updated on approve.
- `credentials`
  - Fields: `tokenId`, `to`, `credentialHash`, `uri`, `txHash`, `issuedAt`.
  - Created after successful issue transaction.

### 5) How to demo (90 seconds)
1. Register: enter Name + NID → get `{ txHash, profileHash }` (save these)
2. Verify: paste `profileHash` or `txHash` → see mock verification result
3. Dashboard: “Grant Issuer Role” → Issue Credential (Recipient/URI/Payload) → success receipt → DB saved
4. Request Access (Subject + Purpose) → copy `requestId` (auto-filled) → Approve (Sign with Wallet) → success receipt; consent updated

### 6) Where this is useful
- KYC/AML consented verification (banks/fintech)
- Academic certificates and skill credentials (tamper-evident)
- Healthcare: patient-controlled data sharing (consent + optional zk proof)
- Employment verification & background checks
- Supply-chain compliance audit trails

### 7) Implementation notes (matches site features)
- Request/Approve flow aligns with on-chain events + consent persistence.
- Issuer role gating and EOA recipient enforcement for safe minting.
- Frontend validations: bytes32 Request ID, Subject wallet enforcement, ABI artifacts handled.
- Verify is a mock for demo; can be replaced with a real ZK verifier.


