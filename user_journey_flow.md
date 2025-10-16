# IdentiChain User Journey Flow

## Complete User Journey Process

```mermaid
flowchart TD
    Start([User Starts]) --> Wallet{Connect MetaMask Wallet}
    Wallet -->|Wallet Connected| Choose[Choose User Type]
    Wallet -->|No Wallet| Install[Install MetaMask]
    Install --> Wallet
    
    Choose --> Gov[Government User]
    Choose --> Telecom[Telecommunication User]
    Choose --> Individual[Individual User]
    
    %% Government User Flow
    Gov --> GovDash[Government Dashboard]
    GovDash --> GrantRole[Grant Issuer Role]
    GrantRole --> IssueCred[Issue Credential]
    IssueCred --> Success1[Credential Issued Successfully]
    
    %% Telecommunication User Flow
    Telecom --> TelecomDash[Telecommunication Dashboard]
    TelecomDash --> ReqAccess[Request Data Access]
    ReqAccess --> AccessForm[Fill Access Request Form]
    AccessForm --> SubmitReq[Submit Request]
    SubmitReq --> WaitApproval[Wait for User Approval]
    
    %% Individual User Flow
    Individual --> UserDash[User Dashboard]
    UserDash --> RegChoice{Already Registered?}
    RegChoice -->|No| Register[User Registration]
    RegChoice -->|Yes| ViewCred[View Credentials]
    
    Register --> RegForm[Fill Registration Form<br/>Name + National ID]
    RegForm --> Encrypt[Encrypt Personal Data]
    Encrypt --> HashProfile[Generate Profile Hash]
    HashProfile --> OnChainReg[Register DID on Blockchain]
    OnChainReg --> RegSuccess[Registration Successful]
    RegSuccess --> ViewCred
    
    ViewCred --> CredActions{Credential Actions}
    CredActions --> VerifyCred[Verify Credential]
    CredActions --> ApproveReq[Approve Access Request]
    
    %% Verification Process
    VerifyCred --> VerifyInput[Enter Profile/TX Hash]
    VerifyInput --> ZKProof[Submit ZK Proof]
    ZKProof --> MockVerify[Mock Verifier Validation]
    MockVerify --> VerifyResult[Verification Result]
    
    %% Access Approval Process
    ApproveReq --> ViewRequests[View Pending Requests]
    ViewRequests --> SelectReq[Select Request]
    SelectReq --> SignConsent[Sign Consent with Wallet]
    SignConsent --> UpdateConsent[Update Consent Status]
    UpdateConsent --> ApprovalSuccess[Access Approved]
    
    %% Cross-user interactions
    WaitApproval --> NotifyUser[Notify Individual User]
    NotifyUser --> ApproveReq
    
    %% End states
    Success1 --> End([Process Complete])
    VerifyResult --> End
    ApprovalSuccess --> End
    
    %% Error handling
    OnChainReg -->|Transaction Failed| RetryTx[Retry Transaction]
    RetryTx --> OnChainReg
    
    SignConsent -->|Signature Failed| RetrySign[Retry Signature]
    RetrySign --> SignConsent
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef success fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Start,End startEnd
    class Register,RegForm,Encrypt,HashProfile,OnChainReg,VerifyCred,VerifyInput,ZKProof,ApproveReq,ViewRequests,SelectReq,SignConsent,UpdateConsent,IssueCred,GrantRole,ReqAccess,AccessForm,SubmitReq process
    class Wallet,Choose,RegChoice,CredActions decision
    class RegSuccess,VerifyResult,ApprovalSuccess,Success1 success
    class RetryTx,RetrySign error
```

## User Journey Breakdown

### 1. Government User Journey
1. **Connect Wallet**: Link MetaMask wallet to application
2. **Access Dashboard**: Enter government-specific dashboard
3. **Grant Issuer Role**: Assign issuer permissions to addresses
4. **Issue Credentials**: Create and issue verifiable credentials
5. **Monitor System**: Track issued credentials and access requests

### 2. Telecommunication User Journey
1. **Connect Wallet**: Link MetaMask wallet to application
2. **Access Dashboard**: Enter telecommunication-specific dashboard
3. **Request Access**: Submit data access requests to individuals
4. **Provide Purpose**: Specify why access is needed
5. **Wait for Approval**: Monitor request status until approved
6. **Access Data**: Retrieve approved data for verification

### 3. Individual User Journey
1. **Connect Wallet**: Link MetaMask wallet to application
2. **Registration**: Create digital identity with encrypted personal data
3. **Receive Credentials**: Accept verifiable credentials from issuers
4. **Manage Access**: Approve or deny data access requests
5. **Verify Credentials**: Use verification tools to prove identity

## Key Decision Points

### Wallet Connection
- **Success**: User proceeds to role selection
- **Failure**: Guided to install MetaMask wallet

### Registration Status
- **New User**: Guided through registration process
- **Existing User**: Direct access to credential management

### Credential Actions
- **Verify**: Submit credentials for validation
- **Approve**: Grant access to requesting parties

## Error Handling

### Transaction Failures
- Automatic retry mechanism for blockchain transactions
- Clear error messages with suggested solutions
- Fallback options for network issues

### Signature Failures
- Retry mechanism for wallet signing
- Alternative signing methods if available
- Clear instructions for manual signing

## Success Indicators

### Registration Success
- ✅ Transaction hash recorded
- ✅ Profile hash generated
- ✅ DID registered on blockchain

### Verification Success
- ✅ ZK proof validated
- ✅ Credential status confirmed
- ✅ Verification result displayed

### Access Approval Success
- ✅ Consent signature recorded
- ✅ Access request approved
- ✅ Audit trail updated
