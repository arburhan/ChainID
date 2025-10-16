# IdentiChain Smart Contract Interactions

## Smart Contract Architecture & Relationships

```mermaid
graph TB
    subgraph "Core Contracts"
        IC[IdentityContract<br/>DID Management<br/>Role-Based Access]
        CC[CredentialContract<br/>ERC-721 Tokens<br/>Verifiable Credentials]
        ACC[AccessControlContract<br/>Consent Management<br/>Access Requests]
        AC[AuditContract<br/>Event Logging<br/>Immutable Records]
    end
    
    subgraph "Verification Layer"
        MV[MockVerifier<br/>ZK Proof Validation<br/>Demo Implementation]
    end
    
    subgraph "External Contracts"
        OZ[OpenZeppelin<br/>AccessControl<br/>Ownable<br/>ERC721]
    end
    
    subgraph "Role Management"
        ADMIN[Admin Role<br/>Contract Owner]
        ISSUER[Issuer Role<br/>Credential Issuers]
        GOVERNMENT[Government Role<br/>System Authority]
        USER[User Role<br/>DID Holders]
    end
    
    %% Contract Dependencies
    IC --> OZ
    CC --> OZ
    CC --> IC
    ACC --> IC
    ACC --> MV
    AC --> OZ
    
    %% Role Assignments
    ADMIN --> IC
    ADMIN --> CC
    ADMIN --> ACC
    ADMIN --> AC
    
    ISSUER --> IC
    ISSUER --> CC
    
    GOVERNMENT --> IC
    GOVERNMENT --> CC
    
    USER --> IC
    USER --> ACC
    
    %% Contract Interactions
    IC -.->|"Check Roles"| CC
    IC -.->|"Validate DID"| ACC
    CC -.->|"Emit Events"| AC
    ACC -.->|"Emit Events"| AC
    MV -.->|"Proof Validation"| ACC
    
    %% Styling
    classDef coreContract fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef verificationContract fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    classDef externalContract fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef role fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    
    class IC,CC,ACC,AC coreContract
    class MV verificationContract
    class OZ externalContract
    class ADMIN,ISSUER,GOVERNMENT,USER role
```

## Contract Interaction Flow

### 1. DID Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Backend
    participant IdentityContract
    participant AccessControl
    
    User->>Backend: Register DID Request
    Backend->>Backend: Encrypt Personal Data
    Backend->>Backend: Generate Profile Hash
    Backend->>IdentityContract: registerDID(profileHash)
    IdentityContract->>IdentityContract: Validate Caller
    IdentityContract->>IdentityContract: Store DID Hash
    IdentityContract-->>Backend: DID Registered Event
    Backend->>AccessControl: Initialize User Access
    AccessControl-->>Backend: Access Initialized
    Backend-->>User: Registration Complete
```

### 2. Credential Issuance Flow

```mermaid
sequenceDiagram
    participant Issuer
    participant Backend
    participant IdentityContract
    participant CredentialContract
    participant AuditContract
    
    Issuer->>Backend: Issue Credential Request
    Backend->>IdentityContract: hasRole(ISSUER_ROLE, issuer)
    IdentityContract-->>Backend: Role Verified
    Backend->>Backend: Generate Credential Hash
    Backend->>CredentialContract: issue(to, hash, uri)
    CredentialContract->>IdentityContract: Check Issuer Role
    IdentityContract-->>CredentialContract: Role Confirmed
    CredentialContract->>CredentialContract: Mint ERC-721 Token
    CredentialContract->>AuditContract: Log Credential Event
    CredentialContract-->>Backend: Credential Issued Event
    Backend-->>Issuer: Credential Created
```

### 3. Access Request & Approval Flow

```mermaid
sequenceDiagram
    participant Requester
    participant Backend
    participant AccessControlContract
    participant IdentityContract
    participant Subject
    participant AuditContract
    
    Requester->>Backend: Request Access
    Backend->>Backend: Generate Purpose Hash
    Backend->>AccessControlContract: requestAccess(subject, purposeHash)
    AccessControlContract->>IdentityContract: Validate Subject DID
    IdentityContract-->>AccessControlContract: DID Valid
    AccessControlContract->>AccessControlContract: Generate Request ID
    AccessControlContract->>AuditContract: Log Access Request
    AccessControlContract-->>Backend: Access Requested Event
    Backend-->>Requester: Request Submitted
    
    Note over Subject: Notification sent
    Subject->>Backend: Approve Access
    Backend->>Backend: Generate ECDSA Signature
    Backend->>AccessControlContract: approve(requestId, signature)
    AccessControlContract->>AccessControlContract: Validate Signature
    AccessControlContract->>AccessControlContract: Verify Subject Identity
    AccessControlContract->>AuditContract: Log Approval Event
    AccessControlContract-->>Backend: Access Approved Event
    Backend-->>Subject: Consent Granted
```

### 4. Verification Flow

```mermaid
sequenceDiagram
    participant Verifier
    participant Backend
    participant MockVerifier
    participant AccessControlContract
    participant AuditContract
    
    Verifier->>Backend: Verify Request
    Backend->>MockVerifier: verify(proof, signalHash)
    MockVerifier->>MockVerifier: Validate Proof Format
    MockVerifier->>AccessControlContract: Check Access Permissions
    AccessControlContract-->>MockVerifier: Access Granted
    MockVerifier->>AuditContract: Log Verification Event
    MockVerifier-->>Backend: Verification Result
    Backend-->>Verifier: Verification Complete
```

## Contract State Management

### State Variables

```mermaid
graph LR
    subgraph "IdentityContract State"
        DIDHashes[DID Hashes Mapping<br/>address => bytes32]
        Roles[Role Management<br/>ISSUER_ROLE, GOVERNMENT_ROLE]
        Owner[Contract Owner<br/>address]
    end
    
    subgraph "CredentialContract State"
        Tokens[Token Data<br/>tokenId => TokenInfo]
        TokenCounter[Token Counter<br/>uint256]
        IdentityRef[Identity Contract Reference<br/>address]
    end
    
    subgraph "AccessControlContract State"
        Requests[Access Requests<br/>bytes32 => RequestInfo]
        Consents[Consent Records<br/>bytes32 => ConsentInfo]
        VerifierRef[Verifier Contract Reference<br/>address]
    end
    
    subgraph "AuditContract State"
        Events[Event Logs<br/>Event[]]
        EventCounter[Event Counter<br/>uint256]
    end
    
    %% State Relationships
    DIDHashes --> Tokens
    Roles --> Tokens
    Requests --> Consents
    VerifierRef --> Requests
    
    %% Styling
    classDef state fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    class DIDHashes,Roles,Owner,Tokens,TokenCounter,IdentityRef,Requests,Consents,VerifierRef,Events,EventCounter state
```

## Event Emission Patterns

### Event Flow Architecture

```mermaid
flowchart TD
    subgraph "Contract Events"
        E1[DIDRegistered<br/>address indexed user, bytes32 profileHash]
        E2[CredentialIssued<br/>uint256 indexed tokenId, address to, bytes32 hash]
        E3[AccessRequested<br/>bytes32 indexed requestId, address subject, bytes32 purpose]
        E4[AccessApproved<br/>bytes32 indexed requestId, bytes signature]
        E5[VerificationCompleted<br/>bytes32 indexed proofHash, bool result]
    end
    
    subgraph "Audit Contract"
        AE[AuditEvent<br/>address indexed contract, string eventType, bytes data]
    end
    
    subgraph "Event Listeners"
        EL1[Backend Event Listener]
        EL2[Frontend Event Monitor]
        EL3[External Integrations]
    end
    
    %% Event Flow
    E1 --> AE
    E2 --> AE
    E3 --> AE
    E4 --> AE
    E5 --> AE
    
    AE --> EL1
    AE --> EL2
    AE --> EL3
    
    EL1 --> EL1
    EL2 --> EL2
    EL3 --> EL3
    
    %% Styling
    classDef event fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef audit fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef listener fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class E1,E2,E3,E4,E5 event
    class AE audit
    class EL1,EL2,EL3 listener
```

## Security Considerations

### Access Control Matrix

| Role | Identity Contract | Credential Contract | Access Control | Audit Contract |
|------|------------------|-------------------|----------------|----------------|
| Admin | Full Control | Full Control | Full Control | Full Control |
| Government | Read Access | Issue Credentials | Read Access | Read Access |
| Issuer | Read Access | Issue Credentials | Read Access | Read Access |
| User | Register DID | Own Tokens | Approve Access | Read Own Events |

### Contract Upgradeability
- **Proxy Pattern**: Not implemented (immutable contracts for security)
- **Role Management**: Admin can add/remove roles dynamically
- **Emergency Functions**: Admin can pause critical functions if needed

### Gas Optimization
- **Event Emission**: Efficient event structures for gas savings
- **Storage Optimization**: Packed structs and efficient data types
- **Batch Operations**: Support for batch processing where applicable
