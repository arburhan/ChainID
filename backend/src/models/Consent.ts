import mongoose, { Schema } from "mongoose";

const ConsentSchema = new Schema({
  requestId: { type: String, index: true, unique: true, required: true },
  requester: { type: String, required: true },
  subject: { type: String, required: true },
  purposeHash: { type: String, required: true },
  approved: { type: Boolean, default: false },
  signature: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const ConsentModel = mongoose.model("Consent", ConsentSchema);
