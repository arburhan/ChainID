# IdentiChain Box Diagrams

## System Architecture Box Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                IdentiChain System                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Frontend      │    │   Backend       │    │   Blockchain    │              │
│  │   Layer         │    │   Layer         │    │   Layer         │              │
│  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤              │
│  │ • React App     │    │ • Express API   │    │ • Smart         │              │
│  │ • MetaMask      │    │ • Node.js       │    │   Contracts     │              │
│  │ • Tailwind CSS  │    │ • MongoDB       │    │ • Ethereum      │              │
│  │ • TypeScript    │    │ • Ethers.js     │    │   Sepolia       │              │
│  │ • QR Scanner    │    │ • JWT Auth      │    │ • IPFS          │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
│           │                       │                       │                     │
│           └───────────────────────┼───────────────────────┘                     │
│                                   │                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Storage Layer                                    │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │ • MongoDB (Encrypted Profiles)  • IPFS (Metadata)  • Redis (Cache)      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## User Interface Framework Box Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            IdentiChain UI Framework                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          Page Components                                │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │   Landing   │  │  Register   │  │  Dashboard  │  │   Verify    │     │    │
│  │  │    Page     │  │    Page     │  │    Page     │  │    Page     │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                   │                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Shared Components                                │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │   Header    │  │   Footer    │  │   Sidebar   │  │   Modal     │     │    │
│  │  │  Component  │  │  Component  │  │  Component  │  │  Component  │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │   Button    │  │    Form     │  │    Table    │  │   Card      │     │    │
│  │  │  Component  │  │  Component  │  │  Component  │  │  Component  │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                   │                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Utility Components                               │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │   QR        │  │   Wallet    │  │   Toast     │  │   Loading   │     │    │
│  │  │  Scanner    │  │  Connector  │  │  Notifier   │  │   Spinner   │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Smart Contract Framework Box Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        IdentiChain Smart Contract Framework                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          Core Contracts                                │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │   │
│  │  │   Identity      │  │   Credential    │  │   Access        │       │   │
│  │  │   Contract      │  │   Contract      │  │   Control       │       │   │
│  │  │                 │  │                 │  │   Contract      │       │   │
│  │  │ • DID Management│  │ • ERC-721       │  │ • Consent       │       │   │
│  │  │ • Role Control  │  │ • Token         │  │   Management    │       │   │
│  │  │ • Profile Hash  │  │   Issuance      │  │ • Access        │       │   │
│  │  │ • User Registry │  │ • Metadata URI  │  │   Requests      │       │   │
│  │  │ • Issuer Roles  │  │ • Revocation    │  │ • Signature     │       │   │
│  │  │ • Government    │  │ • Transfer      │  │   Validation    │       │   │
│  │  │   Roles         │  │ • Ownership     │  │ • Event Logging │       │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Supporting Contracts                            │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │   │
│  │  │     Audit       │  │     Mock        │  │   OpenZeppelin  │       │   │
│  │  │     Contract    │  │     Verifier    │  │   Contracts     │       │   │
│  │  │                 │  │                 │  │                 │       │   │
│  │  │ • Event Logging │  │ • ZK Proof      │  │ • AccessControl │       │   │
│  │  │ • Immutable     │  │   Validation    │  │ • Ownable       │       │   │
│  │  │   Records       │  │ • Mock          │  │ • ERC721        │       │   │
│  │  │ • Compliance    │  │   Implementation│  │ • Reentrancy    │       │   │
│  │  │   Reporting     │  │ • Demo          │  │   Guard         │       │   │
│  │  │ • Audit Trail   │  │   Validation    │  │ • Pausable      │       │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## API Framework Box Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            IdentiChain API Framework                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          API Gateway                                   │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   CORS      │  │    Rate     │  │   Input     │  │   Error     │   │   │
│  │  │  Middleware │  │  Limiting   │  │ Validation  │  │  Handling   │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          API Routes                                    │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   User      │  │  Credential │  │    Access   │  │  Contract   │   │   │
│  │  │   Routes    │  │   Routes    │  │   Routes    │  │   Routes    │   │   │
│  │  │             │  │             │  │             │  │             │   │   │
│  │  │ • POST      │  │ • POST      │  │ • POST      │  │ • GET       │   │   │
│  │  │   /register │  │   /issue    │  │   /request  │  │   /status   │   │   │
│  │  │ • GET       │  │ • POST      │  │ • POST      │  │ • POST      │   │   │
│  │  │   /profile  │  │   /revoke   │  │   /consent  │  │   /deploy   │   │   │
│  │  │ • PUT       │  │ • GET       │  │ • GET       │  │ • GET       │   │   │
│  │  │   /update   │  │   /verify   │  │   /status   │  │   /events   │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          Service Layer                                 │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Identity  │  │ Credential  │  │    Access   │  │    Audit    │   │   │
│  │  │   Service   │  │   Service   │  │   Service   │  │   Service   │   │   │
│  │  │             │  │             │  │             │  │             │   │   │
│  │  │ • DID       │  │ • Token     │  │ • Consent   │  │ • Event     │   │   │
│  │  │   Management│  │   Issuance  │  │   Management│  │   Logging   │   │   │
│  │  │ • Profile   │  │ • Metadata  │  │ • Request   │  │ • Audit     │   │   │
│  │  │   Encryption│  │   Storage   │  │   Processing│  │   Trail     │   │   │
│  │  │ • Hash      │  │ • IPFS      │  │ • Signature │  │ • Compliance│   │   │
│  │  │   Generation│  │   Integration│  │   Validation│  │   Reporting │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Security Framework Box Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        IdentiChain Security Framework                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Authentication Layer                            │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Wallet    │  │   Digital   │  │   Session   │  │   Multi-    │   │   │
│  │  │ Connection  │  │ Signatures  │  │ Management  │  │   Factor    │   │   │
│  │  │             │  │             │  │             │  │   Auth      │   │   │
│  │  │ • MetaMask  │  │ • ECDSA     │  │ • JWT       │  │ • Biometric │   │   │
│  │  │ • Wallet    │  │ • Message   │  │ • Session   │  │ • OTP       │   │   │
│  │  │   Validation│  │   Signing   │  │   Storage   │  │ • Hardware  │   │   │
│  │  │ • Address   │  │ • Nonce     │  │ • Refresh   │  │   Keys      │   │   │
│  │  │   Verification│  │   Validation│  │   Tokens   │  │ • SMS       │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Authorization Layer                             │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Role-     │  │   Smart     │  │   API       │  │   Resource  │   │   │
│  │  │   Based     │  │   Contract  │  │   Access    │  │   Access    │   │   │
│  │  │   Access    │  │   Roles     │  │   Control   │  │   Control   │   │   │
│  │  │   Control   │  │             │  │             │  │             │   │   │
│  │  │ • Admin     │  │ • Issuer    │  │ • Rate      │  │ • File      │   │   │
│  │  │   Role      │  │   Role      │  │   Limiting  │  │   Access    │   │   │
│  │  │ • Government│  │ • Government│  │ • IP        │  │ • Database  │   │   │
│  │  │   Role      │  │   Role      │  │   Filtering │  │   Access    │   │   │
│  │  │ • User      │  │ • User      │  │ • CORS      │  │ • Network   │   │   │
│  │  │   Role      │  │   Role      │  │   Policy    │  │   Access    │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Data Protection Layer                           │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Data      │  │   Hash      │  │   Transport │  │   Storage   │   │   │
│  │  │ Encryption  │  │ Functions   │  │   Security  │  │   Security  │   │   │
│  │  │             │  │             │  │             │  │             │   │   │
│  │  │ • AES-256   │  │ • Keccak256 │  │ • HTTPS/TLS │  │ • MongoDB   │   │   │
│  │  │   -GCM      │  │ • SHA-256   │  │ • WSS       │  │   Encryption│   │   │
│  │  │ • Key       │  │ • Blake2b   │  │ • Certificate│  │ • IPFS      │   │   │
│  │  │   Management│  │ • Merkle    │  │   Pinning   │  │   Encryption│   │   │
│  │  │ • IV        │  │   Trees     │  │ • VPN       │  │ • Redis     │   │   │
│  │  │   Generation│  │ • HMAC      │  │ • Firewall  │  │   Encryption│   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Database Schema Box Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        IdentiChain Database Schema                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          MongoDB Collections                           │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │   │
│  │  │     Users       │  │   Credentials   │  │    Consents     │       │   │
│  │  │   Collection    │  │   Collection    │  │   Collection    │       │   │
│  │  │                 │  │                 │  │                 │       │   │
│  │  │ • _id           │  │ • _id           │  │ • _id           │       │   │
│  │  │ • walletAddress │  │ • tokenId       │  │ • requestId     │       │   │
│  │  │ • encryptedData │  │ • to            │  │ • requester     │       │   │
│  │  │ • profileHash   │  │ • credentialHash│  │ • subject       │       │   │
│  │  │ • createdAt     │  │ • uri           │  │ • purposeHash   │       │   │
│  │  │ • updatedAt     │  │ • txHash        │  │ • approved      │       │   │
│  │  │ • isActive      │  │ • issuedAt      │  │ • signature     │       │   │
│  │  │ • lastLogin     │  │ • revokedAt     │  │ • createdAt     │       │   │
│  │  │ • loginCount    │  │ • isActive      │  │ • updatedAt     │       │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Redis Cache Structure                           │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Session   │  │   API       │  │   Rate      │  │   Temporary │   │   │
│  │  │   Cache     │  │   Cache     │  │   Limiting  │  │   Data      │   │   │
│  │  │             │  │             │  │             │  │             │   │   │
│  │  │ • session:  │  │ • api:      │  │ • rate:     │  │ • temp:     │   │   │
│  │  │   {id}      │  │   {endpoint}│  │   {ip}      │  │   {hash}    │   │   │
│  │  │ • user:     │  │ • response: │  │ • limit:    │  │ • proof:    │   │   │
│  │  │   {address} │  │   {data}    │  │   {count}   │  │   {data}    │   │   │
│  │  │ • token:    │  │ • ttl:      │  │ • window:   │  │ • ttl:      │   │   │
│  │  │   {jwt}     │  │   {seconds} │  │   {minutes} │  │   {seconds} │   │   │
│  │  │ • ttl:      │  │ • hits:     │  │ • reset:    │  │ • created:  │   │   │
│  │  │   {hours}   │  │   {count}   │  │   {timestamp│  │   {timestamp│   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        IPFS Storage Structure                          │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Metadata  │  │   Documents │  │   Images    │  │   Proofs    │   │   │
│  │  │   Files     │  │   Storage   │  │   Storage   │  │   Storage   │   │   │
│  │  │             │  │             │  │             │  │             │   │   │
│  │  │ • credential│  │ • pdf       │  │ • profile   │  │ • zk-proof  │   │   │
│  │  │   metadata  │  │   documents │  │   pictures  │  │   files     │   │   │
│  │  │ • issuer    │  │ • contracts │  │ • certificates│  │ • witness  │   │   │
│  │  │   info      │  │ • reports   │  │ • signatures│  │   data      │   │   │
│  │  │ • schema    │  │ • policies  │  │ • logos     │  │ • public    │   │   │
│  │  │   definitions│  │ • terms     │  │ • avatars   │  │   inputs    │   │   │
│  │  │ • validation│  │ • conditions│  │ • thumbnails│  │ • circuits  │   │   │
│  │  │   rules     │  │ • agreements│  │ • previews  │  │ • artifacts │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Box Diagram Usage Guidelines

### When to Use Box Diagrams:

1. **System Architecture** - High-level system structure and components
2. **Framework Design** - Component relationships and dependencies
3. **Database Schema** - Data structure and relationships
4. **API Design** - Endpoint organization and service layers
5. **Security Architecture** - Security layers and protection mechanisms
6. **Technology Stack** - Technology organization and integration
7. **Deployment Architecture** - Infrastructure and deployment structure

### Box Diagram Best Practices:

1. **Clear Hierarchy** - Use nested boxes to show hierarchical relationships
2. **Consistent Sizing** - Maintain consistent box sizes for similar components
3. **Logical Grouping** - Group related components together
4. **Clear Labels** - Use descriptive labels for all components
5. **Visual Separation** - Use borders and spacing to separate different sections
6. **Color Coding** - Use colors to distinguish different types of components
7. **Connection Lines** - Show relationships between components with lines

### Benefits of Box Diagrams:

- **Visual Clarity** - Easy to understand system structure at a glance
- **Component Relationships** - Shows how different parts of the system relate
- **Framework Understanding** - Helps understand framework organization
- **Documentation** - Serves as comprehensive system documentation
- **Communication** - Effective for communicating with stakeholders
- **Planning** - Useful for system planning and design
- **Maintenance** - Helps with system maintenance and updates
