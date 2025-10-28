import express from 'express';
import { body, validationResult, param } from 'express-validator';
// FIX: Changed from 'import commentController from ...' to wildcard import
import * as commentController from '../controllers/commentController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/comments/:postId - Get all comments for a post
router.get(
  '/:postId',
  [
    param('postId').isMongoId().withMessage('Invalid Post ID format.'),
  ],
  handleValidationErrors,
  commentController.getCommentsByPostId
);

// POST /api/comments/:postId - Create a new comment (PROTECTED)
router.post(
  '/:postId',
  protect, // <--- Ensures user is logged in
  [ // Removed problematic backslash here
    param('postId').isMongoId().withMessage('Invalid Post ID format.'),
    body('content')
        .notEmpty().withMessage('Comment content is required.')
        .isLength({ min: 3, max: 500 }).withMessage('Comment must be between 3 and 500 characters.'),
  ],
  handleValidationErrors,
  commentController.createComment
);

export default router;
