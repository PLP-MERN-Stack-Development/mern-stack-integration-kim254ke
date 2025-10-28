import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    // The content of the comment
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    // Reference to the Post this comment belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // 'Post' must match the Post model's name
      required: true,
    },
    // Reference to the User who wrote the comment
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // 'User' must match the User model's name
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// We add an index to improve query performance when fetching comments for a specific post.
CommentSchema.index({ post: 1 });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;