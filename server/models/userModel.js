// server/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // ✅ Use bcryptjs (not bcrypt)

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isSuperUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Check if admin/superuser
UserSchema.methods.isAdmin = function () {
  return this.role === 'admin' || this.isSuperUser === true;
};

const User = mongoose.model('User', UserSchema);
export default User;
