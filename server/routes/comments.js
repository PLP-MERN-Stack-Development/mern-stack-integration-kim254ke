// server/routes/comments.js
import express from 'express';
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// -----------------------------------------------------------------------------
// COMMENT ROUTES
// -----------------------------------------------------------------------------

// 🔹 Get all comments for a post
// 🔹 Create a new comment for a post (requires authentication)
router
  .route('/:postId')
  .get(getCommentsByPostId)
  .post(protect, createComment);

// 🔹 Update or delete a specific comment by its ID (requires authentication)
router
  .route('/comment/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router; // ✅ ES Module export
