import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  walletAddress: { type: String, index: true, unique: true, required: true },
  email: { type: String, required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String },
  profileHash: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserModel = mongoose.model("User", UserSchema);
