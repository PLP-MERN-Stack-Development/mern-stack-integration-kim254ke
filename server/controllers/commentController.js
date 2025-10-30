// server/controllers/commentController.js

import Comment from '../models/commentModel.js';   // ✅ FIX: Updated to commentModel.js
import Post from '../models/Post.js';         
import asyncHandler from 'express-async-handler';

// =================================================================
// 1. CREATE COMMENT (POST /api/comments/:postId)
// =================================================================
export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // 1. Validate comment content
  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Comment content cannot be empty.');
  }

  // 2. Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found.');
  }

  // 3. Create and save comment
  const newComment = new Comment({
    content,
    post: postId, // Uses 'post' property which aligns with the model update below
    author: req.user._id, // Added via protect middleware
  });

  const savedComment = await newComment.save();

  // 4. Populate author before sending back
  const populatedComment = await Comment.findById(savedComment._id)
    .populate('author', 'username');

  res.status(201).json(populatedComment);
});


// =================================================================
// 2. GET COMMENTS BY POST (GET /api/comments/:postId)
// =================================================================
export const getCommentsByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Validate post ID format
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid post ID.');
  }

  // Uses 'post' field for query
  const comments = await Comment.find({ post: postId }) 
    .sort({ createdAt: 1 }) // oldest → newest
    .populate('author', 'username');

  res.status(200).json(comments);
});


// =================================================================
// 3. UPDATE COMMENT (PUT /api/comments/:id)
// =================================================================
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found.');
  }

  // Only author can update
  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized to update this comment.');
  }

  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Updated content cannot be empty.');
  }

  comment.content = content;
  const updatedComment = await comment.save();

  const populatedComment = await Comment.findById(updatedComment._id)
    .populate('author', 'username');

  res.status(200).json(populatedComment);
});


// =================================================================
// 4. DELETE COMMENT (DELETE /api/comments/:id)
// =================================================================
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found.');
  }

  // Only author can delete
  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized to delete this comment.');
  }

  await Comment.deleteOne({ _id: id });

  res.status(200).json({ message: 'Comment deleted successfully.' });
});