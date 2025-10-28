import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    // Basic fields
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Assuming titles should be unique
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
      // The type must be ObjectId, referencing the Category model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // 'Category' must match the model name in Category.js
      required: true,
    },
    // Metadata
    author: {
      type: String, // You can change this to a User ObjectId later for auth
      required: true,
      default: 'Admin',
    },
    featuredImage: {
      type: String, // URL to the image, for Task 5
      default: 'https://placehold.co/800x450/e9ecef/212529?text=Featured+Image',
    },
    // Status flag (e.g., for drafts)
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
