// server/controllers/categoryController.js
import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(categories);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Protected/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const slug = slugify(name, { lower: true });
  const exists = await Category.findOne({ slug });

  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({ name, slug });
  res.status(201).json(category);
});
