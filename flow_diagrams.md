# IdentiChain Flow Diagrams

## User Registration Process Flow

```mermaid
flowchart TD
    Start([User Starts Registration]) --> Connect{Connect MetaMask Wallet}
    Connect -->|Success| FillForm[Fill Registration Form<br/>Name + National ID]
    Connect -->|Failed| Install[Install MetaMask]
    Install --> Connect
    
    FillForm --> Validate{Validate Input Data}
    Validate -->|Valid| Encrypt[Encrypt Personal Data<br/>AES-256-GCM]
    Validate -->|Invalid| ShowError[Show Validation Error]
    ShowError --> FillForm
    
    Encrypt --> GenerateHash[Generate Profile Hash<br/>Keccak256]
    GenerateHash --> RegisterDID[Register DID on Blockchain<br/>Identity Contract]
    
    RegisterDID --> Success{Transaction Success?}
    Success -->|Yes| StoreData[Store Encrypted Data<br/>MongoDB]
    Success -->|No| Retry[Retry Transaction]
    Retry --> RegisterDID
    
    StoreData --> Complete([Registration Complete<br/>DID + Profile Hash])
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Start,Complete startEnd
    class FillForm,Encrypt,GenerateHash,RegisterDID,StoreData process
    class Connect,Validate,Success decision
    class Install,ShowError,Retry error
```

## Credential Issuance Flow

```mermaid
flowchart TD
    Start([Issuer Starts Process]) --> CheckRole{Check Issuer Role}
    CheckRole -->|Has Role| FillCred[Fill Credential Details<br/>Recipient + Metadata]
    CheckRole -->|No Role| RequestRole[Request Issuer Role]
    RequestRole --> Admin[Admin Grants Role]
    Admin --> FillCred
    
    FillCred --> ValidateCred{Validate Credential Data}
    ValidateCred -->|Valid| UploadMeta[Upload Metadata to IPFS]
    ValidateCred -->|Invalid| ShowError[Show Validation Error]
    ShowError --> FillCred
    
    UploadMeta --> GenerateCredHash[Generate Credential Hash<br/>Keccak256]
    GenerateCredHash --> IssueToken[Issue ERC-721 Token<br/>Credential Contract]
    
    IssueToken --> Success{Transaction Success?}
    Success -->|Yes| StoreCred[Store Credential Record<br/>MongoDB]
    Success -->|No| Retry[Retry Transaction]
    Retry --> IssueToken
    
    StoreCred --> LogEvent[Log Credential Event<br/>Audit Contract]
    LogEvent --> Complete([Credential Issued<br/>Token ID + Hash])
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Start,Complete startEnd
    class FillCred,UploadMeta,GenerateCredHash,IssueToken,StoreCred,LogEvent process
    class CheckRole,ValidateCred,Success decision
    class RequestRole,Admin,ShowError,Retry error
```

## Access Request & Approval Flow

```mermaid
flowchart TD
    Start([Requester Starts]) --> FillRequest[Fill Access Request<br/>Subject + Purpose]
    FillRequest --> ValidateReq{Validate Request Data}
    ValidateReq -->|Valid| GeneratePurposeHash[Generate Purpose Hash<br/>Keccak256]
    ValidateReq -->|Invalid| ShowError[Show Validation Error]
    ShowError --> FillRequest
    
    GeneratePurposeHash --> SubmitRequest[Submit Access Request<br/>Access Control Contract]
    SubmitRequest --> Success{Transaction Success?}
    Success -->|Yes| StorePending[Store Pending Consent<br/>MongoDB]
    Success -->|No| Retry[Retry Transaction]
    Retry --> SubmitRequest
    
    StorePending --> NotifyUser[Notify Subject User<br/>Email/In-App]
    NotifyUser --> WaitApproval[Wait for User Approval]
    
    WaitApproval --> UserDecision{User Decision}
    UserDecision -->|Approve| SignConsent[Sign Consent with Wallet<br/>ECDSA Signature]
    UserDecision -->|Deny| RejectRequest[Reject Access Request]
    UserDecision -->|Timeout| ExpireRequest[Request Expires]
    
    SignConsent --> ValidateSig{Validate Signature}
    ValidateSig -->|Valid| ApproveAccess[Approve Access<br/>Access Control Contract]
    ValidateSig -->|Invalid| RetrySign[Retry Signature]
    RetrySign --> SignConsent
    
    ApproveAccess --> UpdateConsent[Update Consent Status<br/>MongoDB]
    UpdateConsent --> LogApproval[Log Approval Event<br/>Audit Contract]
    LogApproval --> Complete([Access Approved<br/>Data Available])
    
    RejectRequest --> LogRejection[Log Rejection Event<br/>Audit Contract]
    LogRejection --> Rejected([Access Denied])
    
    ExpireRequest --> LogExpiry[Log Expiry Event<br/>Audit Contract]
    LogExpiry --> Expired([Request Expired])
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Start,Complete,Rejected,Expired startEnd
    class FillRequest,GeneratePurposeHash,SubmitRequest,StorePending,NotifyUser,WaitApproval,SignConsent,ApproveAccess,UpdateConsent,LogApproval,RejectRequest,ExpireRequest,LogRejection,LogExpiry process
    class ValidateReq,Success,UserDecision,ValidateSig decision
    class ShowError,Retry,RetrySign error
```

## Verification Process Flow

```mermaid
flowchart TD
    Start([Verifier Starts]) --> InputHash[Input Profile/TX Hash<br/>Text Field]
    InputHash --> ValidateHash{Validate Hash Format}
    ValidateHash -->|Valid| GenerateProof[Generate ZK Proof<br/>Mock Implementation]
    ValidateHash -->|Invalid| ShowError[Show Validation Error]
    ShowError --> InputHash
    
    GenerateProof --> SubmitProof[Submit Proof to Verifier<br/>Mock Verifier Contract]
    SubmitProof --> ValidateProof{Validate Proof}
    ValidateProof -->|Valid| CheckAccess{Check Access Permissions}
    ValidateProof -->|Invalid| ProofError[Proof Validation Failed]
    ProofError --> InputHash
    
    CheckAccess -->|Has Access| VerifyIdentity[Verify Identity<br/>DID Validation]
    CheckAccess -->|No Access| AccessDenied[Access Denied]
    AccessDenied --> Complete
    
    VerifyIdentity --> Success{Verification Success?}
    Success -->|Yes| LogVerification[Log Verification Event<br/>Audit Contract]
    Success -->|No| VerificationFailed[Verification Failed]
    VerificationFailed --> Complete
    
    LogVerification --> Complete([Verification Complete<br/>Result + Proof Hash])
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Start,Complete startEnd
    class InputHash,GenerateProof,SubmitProof,VerifyIdentity,LogVerification process
    class ValidateHash,ValidateProof,CheckAccess,Success decision
    class ShowError,ProofError,AccessDenied,VerificationFailed error
```

## System Error Handling Flow

```mermaid
flowchart TD
    Error([System Error Occurs]) --> ErrorType{Error Type?}
    
    ErrorType -->|Network Error| NetworkHandler[Network Error Handler<br/>Retry with Backoff]
    ErrorType -->|Validation Error| ValidationHandler[Validation Error Handler<br/>Show User Message]
    ErrorType -->|Blockchain Error| BlockchainHandler[Blockchain Error Handler<br/>Gas/Transaction Issues]
    ErrorType -->|Database Error| DatabaseHandler[Database Error Handler<br/>Connection/Query Issues]
    ErrorType -->|Security Error| SecurityHandler[Security Error Handler<br/>Access/Authorization Issues]
    
    NetworkHandler --> RetryLogic{Retry Logic}
    RetryLogic -->|Success| Success[Operation Success]
    RetryLogic -->|Max Retries| Fallback[Fallback Mechanism]
    
    ValidationHandler --> UserMessage[Display User-Friendly Message]
    UserMessage --> UserAction[User Corrects Input]
    UserAction --> RetryOperation[Retry Operation]
    
    BlockchainHandler --> GasCheck{Gas Check}
    GasCheck -->|Low Gas| IncreaseGas[Increase Gas Limit]
    GasCheck -->|High Gas| OptimizeTx[Optimize Transaction]
    GasCheck -->|Network Issue| SwitchRPC[Switch RPC Provider]
    
    DatabaseHandler --> ConnectionCheck{Connection Check}
    ConnectionCheck -->|Connection Lost| Reconnect[Reconnect to Database]
    ConnectionCheck -->|Query Error| OptimizeQuery[Optimize Query]
    ConnectionCheck -->|Timeout| RetryQuery[Retry Query]
    
    SecurityHandler --> AccessCheck{Access Check}
    AccessCheck -->|Invalid Token| RefreshToken[Refresh Authentication Token]
    AccessCheck -->|Insufficient Permissions| RequestPermission[Request Additional Permissions]
    AccessCheck -->|Security Threat| BlockAccess[Block Access + Alert]
    
    %% All paths lead to resolution or escalation
    Success --> Complete([Error Resolved])
    Fallback --> Complete
    RetryOperation --> Complete
    IncreaseGas --> Complete
    OptimizeTx --> Complete
    SwitchRPC --> Complete
    Reconnect --> Complete
    OptimizeQuery --> Complete
    RetryQuery --> Complete
    RefreshToken --> Complete
    RequestPermission --> Complete
    BlockAccess --> Escalate([Escalate to Security Team])
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    classDef security fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class Error,Complete,Escalate startEnd
    class NetworkHandler,ValidationHandler,BlockchainHandler,DatabaseHandler,SecurityHandler,UserMessage,UserAction,RetryOperation,IncreaseGas,OptimizeTx,SwitchRPC,Reconnect,OptimizeQuery,RetryQuery,RefreshToken,RequestPermission,BlockAccess process
    class ErrorType,RetryLogic,GasCheck,ConnectionCheck,AccessCheck decision
    class Fallback,RetryOperation error
    class Escalate security
```

## Data Synchronization Flow

```mermaid
flowchart TD
    Start([Data Sync Trigger]) --> SyncType{Sync Type?}
    
    SyncType -->|Real-time| RealtimeSync[Real-time Sync<br/>Event-driven]
    SyncType -->|Batch| BatchSync[Batch Sync<br/>Scheduled]
    SyncType -->|Manual| ManualSync[Manual Sync<br/>User-initiated]
    
    RealtimeSync --> EventListener[Listen to Blockchain Events]
    EventListener --> ProcessEvent[Process Event Data]
    ProcessEvent --> UpdateDB[Update Database]
    
    BatchSync --> ScheduleCheck{Schedule Check}
    ScheduleCheck -->|Time to Sync| FetchData[Fetch Data from Blockchain]
    ScheduleCheck -->|Not Time| Wait[Wait for Next Schedule]
    Wait --> ScheduleCheck
    
    ManualSync --> UserTrigger[User Triggers Sync]
    UserTrigger --> FetchData
    
    FetchData --> ValidateData{Validate Data}
    ValidateData -->|Valid| ProcessData[Process Data]
    ValidateData -->|Invalid| LogError[Log Sync Error]
    LogError --> RetrySync[Retry Sync]
    RetrySync --> FetchData
    
    ProcessData --> UpdateDB
    UpdateDB --> Success{Update Success?}
    Success -->|Yes| LogSuccess[Log Sync Success]
    Success -->|No| HandleError[Handle Update Error]
    HandleError --> RetryUpdate[Retry Update]
    RetryUpdate --> UpdateDB
    
    LogSuccess --> Complete([Sync Complete])
    LogError --> Complete
    
    %% Styling
    classDef startEnd fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Start,Complete startEnd
    class RealtimeSync,BatchSync,ManualSync,EventListener,ProcessEvent,UpdateDB,ScheduleCheck,Wait,UserTrigger,FetchData,ProcessData,LogSuccess,RetrySync,HandleError,RetryUpdate process
    class SyncType,ValidateData,Success decision
    class LogError,RetrySync,HandleError,RetryUpdate error
```

## Flow Diagram Usage Guidelines

### When to Use Flow Diagrams:

1. **Process Documentation** - Documenting step-by-step processes
2. **User Journey Mapping** - Showing user interactions and decision points
3. **Error Handling** - Illustrating error scenarios and recovery paths
4. **System Workflows** - Showing system-level processes and data flow
5. **Decision Trees** - Mapping decision points and their outcomes
6. **Troubleshooting Guides** - Creating step-by-step problem resolution flows

### Flow Diagram Best Practices:

1. **Clear Start and End Points** - Always show where processes begin and end
2. **Decision Points** - Use diamond shapes for decision points with clear yes/no paths
3. **Process Steps** - Use rectangles for process steps with clear descriptions
4. **Error Handling** - Include error paths and recovery mechanisms
5. **Parallel Processes** - Show concurrent processes where applicable
6. **Swimlanes** - Use swimlanes to separate different actors or systems
7. **Consistent Styling** - Use consistent colors and shapes for similar elements

### Benefits of Flow Diagrams:

- **Process Clarity** - Makes complex processes easy to understand
- **Error Identification** - Helps identify potential failure points
- **User Experience** - Improves user experience by showing clear paths
- **Documentation** - Serves as comprehensive process documentation
- **Training** - Helps train new team members on system processes
- **Optimization** - Identifies opportunities for process improvement
