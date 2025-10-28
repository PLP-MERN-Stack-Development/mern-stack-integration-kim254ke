import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // Recommended for handling async Express errors

// ------------------------------------------------
// 1. JWT Generator (Secret MUST be in .env)
// ------------------------------------------------
const generateToken = (id) => {
  // Use a secret from your environment variables
  // NOTE: Ensure process.env.JWT_SECRET is accessible (e.g., using 'dotenv' package)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validation check for required fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please enter all required fields: username, email, and password.');
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists.');
  }

  // 3. Create the new user (password is hashed in the User model pre-save hook)
  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    // 4. Successful registration response
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // Generate and send JWT
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data received.');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Validation check for required fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password.');
  }

  // 2. Find the user by email
  const user = await User.findOne({ email });

  // 3. Check if user exists AND if the password matches (using the model method)
  if (user && (await user.matchPassword(password))) {
    // 4. Successful login response
    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // Generate and send JWT
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password.');
  }
});

// REMOVED: export default { registerUser, loginUser };
// The functions are now exported directly using `export const`
