// server/scripts/makeSuperUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

dotenv.config();

const makeSuperUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    let user = await User.findOne({ email });

    if (!user) {
      console.log(`⚠️ No user found with email ${email}. Creating one now...`);
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await User.create({
        username: email.split('@')[0],
        email,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log(`✅ User created and granted admin rights: ${email}`);
    } else {
      user.isAdmin = true;
      await user.save();
      console.log(`✅ ${user.email} is now a super user!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.error('⚠️ Usage: node server/scripts/makeSuperUser.js <email>');
  process.exit(1);
}

makeSuperUser(email);
