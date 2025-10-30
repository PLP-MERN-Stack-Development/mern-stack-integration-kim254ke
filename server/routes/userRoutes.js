// server/routes/userRoutes.js

import express from 'express';
// Assuming your controller functions are exported as named exports
import { 
  registerUser, 
  loginUser 
} from '../controllers/userController.js'; 

const router = express.Router();

// Define routes using the imported controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

// This is the CRUCIAL line that provides the 'default' export 
// expected by your server.js file.
export default router;