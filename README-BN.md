## চেইনআইডি (IdentiChain) – ওয়েবসাইটের কার্যকারিতা ও ব্যবহার নির্দেশিকা (বাংলা)

এই ডকুমেন্টে আপনার ওয়েবসাইট/ড্যাপের বিভিন্ন অংশ কী কাজ করে, কোথায় কী ইনপুট লাগে এবং উদাহরণসহ ডাটা কেমন হবে তা ব্যাখ্যা করা হয়েছে। ফ্রন্টএন্ড React + Vite এবং ব্যাকএন্ড Node/Express; স্মার্ট কন্ট্রাক্টগুলো Ethereum নেটওয়ার্কে ডিপ্লয় করা।

---

## আর্কিটেকচার সংক্ষেপ
- **ফ্রন্টএন্ড**: `frontend/` – React UI, ওয়ালেট কানেক্ট, কন্ট্রাক্ট কল।
- **ব্যাকএন্ড**: `backend/` – REST API, সার্ভার-সাইড কন্ট্রাক্ট কল/সিগনেচার/ভেরিফিকেশন।
- **কন্ট্রাক্টস**: `contracts/` – Solidity কন্ট্রাক্ট, ডিপ্লয় স্ক্রিপ্ট, ABI।

---

## ফ্রন্টএন্ডের প্রধান পেজসমূহ

### 1) Landing (`frontend/src/pages/Landing.tsx`)
- **কাজ**: প্রজেক্ট পরিচিতি, ওয়ালেট কানেক্ট বাটন/CTA-তে নিয়ে যাওয়া।
- **ইনপুট**: কোনো ফর্ম ইনপুট নেই। ইউজারকে ওয়ালেট (MetaMask ইত্যাদি) কানেক্ট করতে বলা হয়।
- **আউটপুট/ইন্টারঅ্যাকশন**: কানেক্ট হলে `Dashboard`/রেজিস্টার ফ্লোতে যেতে পারেন।

### 2) Register (`frontend/src/pages/Register.tsx`)
- **কাজ**: ইউজারের প্রোফাইল অন-চেইন আইডেন্টিটি (DID) রেজিস্টার করা।
- **ইনপুট**: প্রোফাইল তথ্য (JSON/ফর্ম)। উদাহরণ:

```json
{
  "name": "Arifur Rahman",
  "nationalId": "NID-1234567890",
}
```

- **কীভাবে কাজ করে**:
  - ফ্রন্টএন্ড প্রোফাইল অবজেক্ট নেয় → ব্যাকএন্ডের `/api/register` এ পোস্ট করে।
  - ব্যাকএন্ড স্মার্ট কন্ট্রাক্ট `Identity`-তে `registerDID(profileHash)` কল করতে পারে বা গাইডলাইন অনুযায়ী প্রসেস করে।

### 3) Verify (`frontend/src/pages/Verify.tsx`)
- **কাজ**: কোন ক্রেডেনশিয়াল/প্রুফ ভেরিফাই করা।
- **ইনপুট**: `tokenId` অথবা প্রুফ-সম্পর্কিত আইডেন্টিফায়ার। উদাহরণ:

```json
{
  "tokenId": "42"
}
```

- **কীভাবে কাজ করে**:
  - ফ্রন্টএন্ড ব্যাকএন্ডের `/api/contracts/verifier/verify` এ `{ proof, signalHash }` পাঠায় (এখানে সিম্পল ফ্লোতে `tokenId` উভয়ের জায়গায় ব্যবহার হয়েছে)।
  - ব্যাকএন্ড `MockVerifier` কন্ট্রাক্টের মাধ্যমে `verify(proof, signalHash)` কল করে।

### 4) Dashboard (`frontend/src/pages/Dashboard.tsx`)
- **কাজ**: সামগ্রিক স্ট্যাটাস/অ্যাকশন: ইস্যু/রিভোক, অ্যাক্সেস রিকোয়েস্ট, অ্যাপ্রুভাল, রেজিস্ট্রেশন স্ট্যাটাস দেখা ইত্যাদি।
- **ইনপুট**: বিভিন্ন অ্যাকশনের জন্য প্রয়োজনীয় ফিল্ড (নীচে কন্ট্রাক্ট ইন্টারঅ্যাকশন সেকশনে বিস্তারিত আছে)।
- **দেখাবে**: কানেক্টেড অ্যাড্রেস, ব্যালেন্স, রেজিস্টার্ড কিনা ইত্যাদি।

---

## ওয়ালেট কানেকশন ও কনট্রাক্ট ইউটিলস
- `frontend/src/lib/contracts.ts` এ কনট্রাক্ট অ্যাড্রেস/ABI এবং হেল্পার ফাংশন আছে।
- `frontend/src/hooks/useContracts.ts` হুক দিয়ে:
  - **connectWallet()**: ইউজারের Ethereum ওয়ালেট কানেক্ট করে।
  - **contracts**: তৈরি করা কন্ট্রাক্ট ইন্সট্যান্সসমূহ `identity`, `credential`, `accessControl`, `audit`, `mockVerifier`।

পরিবেশ ভেরিয়েবল (উদাহরণ):

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_IDENTITY_CONTRACT_ADDRESS=0xYourIdentityContract
VITE_CREDENTIAL_CONTRACT_ADDRESS=0xYourCredentialContract
VITE_ACCESS_CONTROL_CONTRACT_ADDRESS=0xYourAccessControlContract
VITE_AUDIT_CONTRACT_ADDRESS=0xYourAuditContract
VITE_MOCK_VERIFIER_ADDRESS=0xYourMockVerifier
```

---

## ব্যাকএন্ড API – এন্ডপয়েন্ট, ইনপুট/আউটপুট ও উদাহরণ

> বেস URL: `VITE_BACKEND_URL` (ডিফল্ট `http://localhost:4000`)

### 1) রেজিস্টার DID – `POST /api/register`
- **ইনপুট (JSON)**:

```json
{
  "address": "0x1234...ABCD",
  "profile": {
    "name": "Arifur Rahman",
    "nationalId": "NID-1234567890",
  }
}
```

- **আউটপুট (সাকসেস)**:

```json
{
  "status": "ok",
  "txHash": "0xabc...",
  "did": "did:ethr:0x1234...ABCD"
}
```

### 2) ক্রেডেনশিয়াল ইস্যু – `POST /api/contracts/credential/issue`
- **ইনপুট (JSON)**:

```json
{
  "to": "0xRecipientAddress",
  "credentialHash": "0x6b1f...", 
  "uri": "ipfs://bafy.../credential.json"
}
```

- **আউটপুট (সাকসেস)**:

```json
{
  "status": "ok",
  "txHash": "0xdef...",
  "tokenId": "42"
}
```

### 3) সাইনার ইনফো – `GET /api/contracts/signer`
- **আউটপুট (উদাহরণ)**:

```json
{
  "address": "0xDeployerOrServerSigner",
  "network": "sepolia",
  "IdentiChain": 11155111
}
```

### 4) ইস্যুয়ার যোগ – `POST /api/contracts/identity/add-issuer`
- **ইনপুট (JSON)**:

```json
{ "account": "0xIssuerAddress" }
```

- **আউটপুট (সাকসেস)**:

```json
{ "status": "ok", "txHash": "0xadd..." }
```

### 5) অ্যাক্সেস রিকোয়েস্ট – `POST /api/contracts/access/request`
- **ইনপুট (JSON)**:

```json
{
  "subject": "0xUserWhoseDataIsRequested",
  "purposeHash": "0x3f9a..." 
}
```

- **আউটপুট (সাকসেস)**:

```json
{ "status": "ok", "requestId": "0xreq123" }
```

### 6) কনসেন্ট/অ্যাপ্রুভ – `POST /api/contracts/access/approve`
- **ইনপুট (JSON)**:

```json
{
  "requestId": "0xreq123",
  "signature": "0xsig...",
  "proof": "0xoptionalProofOr0x"
}
```

- **আউটপুট (সাকসেস)**:

```json
{ "status": "ok", "txHash": "0xapr..." }
```

### 7) ভেরিফাই – `POST /api/contracts/verifier/verify`
- **ইনপুট (JSON)**:

```json
{
  "proof": "42",
  "signalHash": "42"
}
```

- **আউটপুট (উদাহরণ)**:

```json
{ "valid": true }
```

---

## ফ্রন্টএন্ড থেকে কন্ট্রাক্ট ইন্টারঅ্যাকশন (useContracts)

`useContracts()` হুকের রিটার্নকৃত মেথডসমূহ ও উদাহরণ ইনপুট:

1) `connectWallet()` – ওয়ালেট কানেক্ট করবে। ইনপুট নেই।

2) `registerDID(profileHash: string)`
   - ইনপুট উদাহরণ: `profileHash = 0xabc123...` (প্রোফাইল JSON-এর কেকা৩৫৬ হ্যাশ)

3) `addIssuer(account: string)`
   - ইনপুট উদাহরণ: `account = 0xIssuerAddress`

4) `issueCredential(to: string, credentialHash: string, uri: string)`
   - ইনপুট উদাহরণ:
```json
{
  "to": "0xRecipientAddress",
  "credentialHash": "0x6b1f...",
  "uri": "ipfs://bafy.../credential.json"
}
```

5) `revokeCredential(tokenId: number)`
   - ইনপুট উদাহরণ: `tokenId = 42`

6) `requestAccess(subject: string, purposeHash: string)`
   - ইনপুট উদাহরণ:
```json
{
  "subject": "0xUserWhoseDataIsRequested",
  "purposeHash": "0x3f9a..."
}
```

7) `approveAccess(requestId: string, signature: string, proof?: string)`
   - ইনপুট উদাহরণ:
```json
{
  "requestId": "0xreq123",
  "signature": "0xsig...",
  "proof": "0xoptional"
}
```

8) `verifyProof(proof: string, signalHash: string)`
   - ইনপুট উদাহরণ: `proof = "42"`, `signalHash = "42"`

9) `isRegistered(user: string)`
   - ইনপুট উদাহরণ: `user = 0x1234...ABCD`

ইউটিলস:
- `stringToBytes32(str)` → উদাহরণ: `"KYC"` → `0x...` হ্যাশ
- `randomBytes32()` → র‍্যান্ডম ৩২-বাইট হেক্স স্ট্রিং
- `formatAddress(addr)` → `0x1234...ABCD`
- `isValidAddress(addr)` → `true/false`

---

## দ্রুত টেস্ট ফ্লো (লোকাল)
1) ব্যাকএন্ড চালু: `cd backend && npm run dev`
2) ফ্রন্টএন্ড চালু: `cd frontend && npm run dev`
3) ব্রাউজারে খোলুন: `http://localhost:5173`
4) ওয়ালেট কানেক্ট → Register পেজে প্রোফাইল সাবমিট → Dashboard/Verify পেজে একশন নিন।

---

## নোট
- কন্ট্রাক্ট অ্যাড্রেসগুলো `.env`/Vite env-এ সঠিকভাবে সেট করুন।
- টেস্টনেট হিসেবে `Sepolia` কনফিগ দেওয়া আছে। প্রয়োজনে RPC/চেইনআইডি আপডেট করুন।


