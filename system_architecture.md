# IdentiChain System Architecture

## High-Level System Architecture

```mermaid
graph TB
    subgraph "User Layer"
        U1[Government User]
        U2[Telecommunication User]
        U3[Individual User]
    end
    
    subgraph "Frontend Layer"
        F1[React Frontend<br/>Vite + Tailwind]
        F2[MetaMask Integration]
        F3[QR Scanner Component]
    end
    
    subgraph "API Gateway Layer"
        G1[Express.js API Server<br/>Port 4000]
        G2[CORS & Rate Limiting]
        G3[Authentication Middleware]
    end
    
    subgraph "Backend Services"
        S1[Identity Service<br/>DID Registration]
        S2[Credential Service<br/>ERC-721 Issuance]
        S3[Access Control Service<br/>Consent Management]
        S4[Verification Service<br/>ZK Proof Verification]
        S5[Email Service<br/>Notifications]
        S6[Audit Service<br/>Event Logging]
    end
    
    subgraph "Blockchain Layer (Ethereum Sepolia)"
        B1[Identity Contract<br/>DID Management]
        B2[Credential Contract<br/>ERC-721 Tokens]
        B3[Access Control Contract<br/>Consent Requests]
        B4[Audit Contract<br/>Event Logs]
        B5[Mock Verifier<br/>ZK Proof Validation]
    end
    
    subgraph "Storage Layer"
        D1[(MongoDB<br/>Encrypted Profiles)]
        D2[(IPFS<br/>Metadata Storage)]
        D3[Redis Cache<br/>Session Management]
    end
    
    subgraph "External Services"
        E1[Sepolia RPC<br/>Infura/Alchemy]
        E2[Email Provider<br/>SMTP Service]
    end
    
    %% User to Frontend connections
    U1 --> F1
    U2 --> F1
    U3 --> F1
    
    %% Frontend to Gateway connections
    F1 --> G1
    F2 --> G1
    F3 --> G1
    
    %% Gateway to Services connections
    G1 --> S1
    G1 --> S2
    G1 --> S3
    G1 --> S4
    G1 --> S5
    G1 --> S6
    
    %% Services to Blockchain connections
    S1 --> B1
    S2 --> B2
    S3 --> B3
    S4 --> B5
    S6 --> B4
    
    %% Services to Storage connections
    S1 --> D1
    S2 --> D1
    S3 --> D1
    S6 --> D1
    S2 --> D2
    G1 --> D3
    
    %% External service connections
    S1 --> E1
    S2 --> E1
    S3 --> E1
    S4 --> E1
    S5 --> E2
    
    %% Blockchain to RPC connection
    B1 --> E1
    B2 --> E1
    B3 --> E1
    B4 --> E1
    B5 --> E1
    
    %% Styling
    classDef userLayer fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef frontendLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef gatewayLayer fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef serviceLayer fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef blockchainLayer fill:#fff8e1,stroke:#f57f17,stroke-width:2px
    classDef storageLayer fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef externalLayer fill:#f1f8e9,stroke:#558b2f,stroke-width:2px
    
    class U1,U2,U3 userLayer
    class F1,F2,F3 frontendLayer
    class G1,G2,G3 gatewayLayer
    class S1,S2,S3,S4,S5,S6 serviceLayer
    class B1,B2,B3,B4,B5 blockchainLayer
    class D1,D2,D3 storageLayer
    class E1,E2 externalLayer
```

## Component Relationships

### Frontend Components
- **React Application**: Main user interface built with Vite and Tailwind CSS
- **MetaMask Integration**: Handles wallet connections and transaction signing
- **QR Scanner**: Captures QR codes for credential verification

### Backend Services
- **Identity Service**: Manages DID registration and profile encryption
- **Credential Service**: Handles ERC-721 token issuance and metadata
- **Access Control Service**: Manages consent requests and approvals
- **Verification Service**: Processes ZK proof verification
- **Email Service**: Sends notifications and alerts
- **Audit Service**: Logs all system events for compliance

### Smart Contracts
- **Identity Contract**: Core DID management with role-based access
- **Credential Contract**: ERC-721 implementation for verifiable credentials
- **Access Control Contract**: Consent request and approval mechanism
- **Audit Contract**: Immutable event logging
- **Mock Verifier**: Placeholder for ZK proof validation

### Data Storage
- **MongoDB**: Encrypted profile storage with AES-256-GCM
- **IPFS**: Decentralized metadata and document storage
- **Redis**: Session management and caching

## Security Architecture

### Encryption Layers
1. **On-chain**: Only hashes and metadata stored
2. **Off-chain**: Sensitive data encrypted with AES-256-GCM
3. **Transport**: HTTPS/TLS for all API communications
4. **Signatures**: ECDSA signatures for consent approvals

### Access Control
1. **Role-based**: Issuer and Government roles on blockchain
2. **Wallet-based**: User authentication via MetaMask
3. **Consent-based**: Subject-controlled data access
4. **Audit trail**: All actions logged immutably
