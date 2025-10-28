import Category from '../models/Category.js';
import slugify from 'slugify'; // Need to install this package

// Helper function to create a basic error response
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

// @desc    Get all Categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    sendError(res, 500, 'Failed to fetch categories.');
  }
};

// @desc    Create a new Category
// @route   POST /api/categories
// @access  Public (for now, will be Private/Admin later)
const createCategory = async (req, res) => {
  const { name } = req.body;
  let { slug } = req.body; // Allows slug to be optional/automatically generated

  try {
    // 1. Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return sendError(res, 400, 'A category with this name already exists.');
    }

    // 2. Generate slug if not provided by the user
    if (!slug) {
      slug = slugify(name, { lower: true, strict: true });
    }

    // 3. Create the new category
    const category = await Category.create({ name, slug });

    res.status(201).json({ 
      success: true, 
      message: 'Category created successfully.', 
      data: category 
    });

  } catch (error) {
    // Handle database errors (e.g., if generated slug is not unique)
    if (error.code === 11000) { // MongoDB duplicate key error code
        return sendError(res, 400, 'Category slug must be unique. Please try a different name.');
    }
    // Handle other errors
    sendError(res, 500, error.message);
  }
};

export default {
  getCategories,
  createCategory,
};
