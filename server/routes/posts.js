// server/routes/posts.js (Changes in POST /api/posts route)

import express from 'express';
import { body, validationResult, param } from 'express-validator';
import postController from '../controllers/postController.js'; 
import protect from '../middleware/authMiddleware.js'; 
import { uploadSingleImage } from '../middleware/uploadMiddleware.js'; // <-- NEW IMPORT

// ... (handleValidationErrors and router setup)

// POST /api/posts - Create a new blog post
router.post(
  '/',
  protect, 
  uploadSingleImage, // <-- ADD MULTER MIDDLEWARE HERE
  [
    // NOTE: You must now remove 'content' validation here, as Multer changes req.body
    // You should manually validate these fields in the controller if needed
    body('title') // Keep this validation if you want it to run before the file upload
        .notEmpty().withMessage('Title is required.'),
    body('category') // Keep this validation
        .isMongoId().withMessage('Category ID is required and must be a valid ID.'),
  ],
  handleValidationErrors,
  postController.createPost
);

// ... (PUT and DELETE routes remain the same for now)

export default router;