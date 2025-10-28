import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    // The name of the category (e.g., 'Technology', 'Travel').
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // A slug for clean URLs (e.g., 'technology' or 'travel').
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Category = mongoose.model('Category', CategorySchema);
export default Category;
