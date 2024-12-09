import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true, required: true },
    token: { type: String},
    otpExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

const AdminUser = mongoose.model('AdminUser', userSchema);
export default AdminUser;