import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  emailVerified: { type: Boolean, default: false },

  // Verification fields
  verificationCode: { type: String },
  verificationCodeExpires: { type: Number },

  // Password reset fields
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Number },

  image: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);