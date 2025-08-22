import mongoose, { Schema } from "mongoose";

const EncryptedSchema = new Schema({
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  ciphertext: { type: String, required: true }
}, { _id: false });

const ProfileSchema = new Schema({
  address: { type: String, index: true, unique: true, required: true },
  profile: { type: EncryptedSchema, required: true },
  profileHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ProfileModel = mongoose.model("Profile", ProfileSchema);
