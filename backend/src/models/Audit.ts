import mongoose, { Schema } from "mongoose";

const AuditSchema = new Schema({
  type: { type: String, required: true }, // e.g., REGISTER, ISSUE, REVOKE, ACCESS_REQUEST, ACCESS_APPROVE, VERIFY
  actor: { type: String, index: true }, // wallet or system address
  subject: { type: String }, // optional second party
  requestId: { type: String },
  tokenId: { type: String },
  txHash: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export const AuditModel = mongoose.model("Audit", AuditSchema);


