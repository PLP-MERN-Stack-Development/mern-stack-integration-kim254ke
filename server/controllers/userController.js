import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // Recommended for handling async Express errors

// Helper function for consistent error responses (use your existing one or this)
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

// ------------------------------------------------
// 1. JWT Generator (Secret MUST be in .env)
// ------------------------------------------------
const generateToken = (id) => {
  // Use a secret from your environment variables
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // If you're using express-async-handler, you can throw an Error
    res.status(400);
    throw new Error('User with this email already exists.');
  }

  // 2. Create the new user (password is hashed in the User model pre-save hook)
  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND if the password matches (using the model method)
  if (user && (await user.matchPassword(password))) {
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

export default {
  registerUser,
  loginUser,
};