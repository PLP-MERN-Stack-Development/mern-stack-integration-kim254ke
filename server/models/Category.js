// server/models/Category.js - This MUST be the Mongoose Model

import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Adding a slug for easy URL usage and query filtering
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to automatically create the slug before saving
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  }
  next();
});

const Category = mongoose.model('Category', CategorySchema);

export default Category; // ✅ Export the Mongoose Model