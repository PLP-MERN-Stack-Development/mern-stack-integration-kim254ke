// server/models/commentModel.js

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    // NOTE: This field should likely be 'content' not 'text' 
    // to match what is being sent from the controller (req.body.content)
    content: { type: String, required: true, trim: true }, 
    
    // ✅ FIX: Changed property name from 'postId' to 'post' for consistency
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    // NOTE: This field should likely be 'author' not 'user' 
    // to match what is being sent from the controller (req.user._id)
    author: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;