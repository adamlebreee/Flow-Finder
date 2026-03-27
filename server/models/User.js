const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true }, // 'google'
    providerUserId: { type: String, required: true },
    email: { type: String },
    emailVerified: { type: Boolean },
    name: { type: String },
    picture: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ provider: 1, providerUserId: 1 }, { unique: true });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
