import Comment from '../models/comment.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

// Helper for consistent error responses
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

// @desc    Get comments for a specific post
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the postId is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return sendError(res, 400, 'Invalid Post ID format.');
    }

    // Find all comments for the post, and populate the author's username
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username') // Only project the username field
      .sort({ createdAt: 1 }); // Sort by oldest first (standard comment order)

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    sendError(res, 500, 'Failed to fetch comments.');
  }
};

// @desc    Create a new comment on a post
// @route   POST /api/comments/:postId
// @access  Private (Requires JWT token and user authentication)
const createComment = async (req, res) => {
  // The 'req.user' object comes from the 'protect' middleware
  const { content } = req.body;
  const { postId } = req.params;
  const authorId = req.user._id;

  // Basic validation
  if (!content) {
    return sendError(res, 400, 'Comment content is required.');
  }
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return sendError(res, 400, 'Invalid Post ID format.');
  }

  try {
    // 1. Verify the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return sendError(res, 404, 'Post not found.');
    }

    // 2. Create the new comment
    const comment = await Comment.create({
      content,
      post: postId,
      author: authorId,
    });

    // 3. Add the comment ID to the Post's comments array
    post.comments.push(comment._id);
    await post.save();

    // 4. Return the new comment, populated with author info
    const newComment = await Comment.findById(comment._id)
        .populate('author', 'username');

    res.status(201).json({ 
      success: true, 
      message: 'Comment created successfully.', 
      data: newComment 
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export default {
  getCommentsByPostId,
  createComment,
};