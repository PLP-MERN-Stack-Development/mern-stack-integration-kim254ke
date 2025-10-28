import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
  },
  {
    timestamps: true,
  }
);

// ------------------------------------------------
// 1. Password Hashing (Pre-save Middleware)
// ------------------------------------------------

UserSchema.pre('save', async function (next) {
  // Only hash if the password field is being modified
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ------------------------------------------------
// 2. Password Comparison Method
// ------------------------------------------------

UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the plain text password with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', UserSchema);
export default User;