import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    // Basic fields
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    // Relationship to Category Model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', 
      required: true,
    },
    // The author is now the User ID from the User model (for authentication)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    // Featured Image for Task 5
    featuredImage: {
      type: String, 
      default: 'https://placehold.co/800x450/e9ecef/212529?text=Featured+Image',
    },
    // Comments Array (New Addition for Task 5)
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Links to the new Comment model
      },
    ],
    // Status flag
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', PostSchema);
export default Post;