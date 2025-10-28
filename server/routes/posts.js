import { Router } from 'express';
import { body, validationResult } from 'express-validator';

// FIX: Change to wildcard import (* as) to correctly import all named exports 
// from the controller, resolving the "does not provide an export named 'default'" error.
import * as postController from '../controllers/postController.js'; 
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js'; 

const router = Router();

// Middleware to handle validation errors (if any occur before the controller)
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/posts - Create a new blog post with a featured image
router.post(
  '/',
  protect, // Ensure the user is logged in
  uploadSingleImage, // Handle the file upload (sets req.file and parses req.body)
  [
    // Validate required text fields that came from the form submission (req.body)
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.'),
    body('category')
        .optional({ checkFalsy: true }) // Allow category to be optional/empty string
        .isMongoId().withMessage('Category must be a valid ID if provided.'),
    // Note: 'content' can also be validated here if desired
  ],
  handleValidationErrors,
  // Use the imported object to access the function: postController.createPost
  postController.createPost 
);

// Example GET route for completeness (assuming getAllPosts is also a named export)
router.get('/', postController.getAllPosts);

// Example GET by ID route for completeness
router.get('/:id', postController.getPostById);


// Export the router
export default router;
