import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', userController.loginUser);

// You can add a protected route here later to get user profile details
// router.get('/profile', protect, userController.getUserProfile); 

export default router;