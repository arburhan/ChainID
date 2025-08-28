import mongoose, { Schema } from "mongoose";

const CredentialSchema = new Schema({
  tokenId: { type: String, index: true, unique: true, required: true },
  to: { type: String, index: true, required: true },
  credentialHash: { type: String, required: true },
  uri: { type: String, required: true },
  txHash: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now }
});

export const CredentialModel = mongoose.model("Credential", CredentialSchema);


