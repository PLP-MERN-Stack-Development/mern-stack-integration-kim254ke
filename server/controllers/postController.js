// server/controllers/postController.js
import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Category from '../models/Category.js';

// Note: Make sure you have these packages installed:
// npm install express-async-handler

// =================================================================
// 1. CREATE POST
// =================================================================
export const createPost = asyncHandler(async (req, res) => {
  const { title, slug, content, category } = req.body;

  // Validate required fields
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Please provide title, content, and category');
  }

  // Check if slug already exists
  const existingPost = await Post.findOne({ slug });
  if (existingPost) {
    res.status(400);
    throw new Error('A post with this slug already exists');
  }

  // Create post object
  const postData = {
    title,
    slug,
    content,
    category,
    author: req.user._id, // From auth middleware
  };

  // Add featured image if uploaded
  if (req.file) {
    postData.featuredImage = `/uploads/${req.file.filename}`;
  }

  const post = await Post.create(postData);

  // Populate author and category before sending response
  await post.populate('author', 'username email');
  await post.populate('category', 'name slug');

  res.status(201).json({
    success: true,
    data: post,
  });
});

// =================================================================
// 2. GET ALL POSTS (Supports filtering by category or search)
// =================================================================
export const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', category = '' } = req.query;

  const filter = {};

  // Category filter - supports name or ObjectId
  if (category && category !== 'All' && category !== 'null') {
    try {
      let categoryId = null;

      // If valid ObjectId, use directly
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryId = category;
      } else {
        // Otherwise, look up by name or slug
        const foundCategory = await Category.findOne({
          $or: [{ name: category }, { slug: category }],
        });
        if (foundCategory) categoryId = foundCategory._id;
      }

      if (categoryId) {
        filter.category = categoryId;
      } else {
        console.warn(`⚠️ Category "${category}" not found. Returning all posts.`);
      }
    } catch (err) {
      console.error('❌ Error processing category filter:', err.message);
    }
  }

  // Search filter (by title or content)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('author', 'username')
    .populate('category', 'name slug');

  const total = await Post.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// =================================================================
// 3. GET SINGLE POST BY ID
// =================================================================
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username email')
    .populate('category', 'name slug');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// =================================================================
// 4. UPDATE POST
// =================================================================
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is the author
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this post');
  }

  const { title, slug, content, category } = req.body;

  // Update fields
  if (title) post.title = title;
  if (slug) post.slug = slug;
  if (content) post.content = content;
  if (category) post.category = category;

  // Update featured image if new one is uploaded
  if (req.file) {
    post.featuredImage = `/uploads/${req.file.filename}`;
  }

  const updatedPost = await post.save();

  // Populate before sending response
  await updatedPost.populate('author', 'username email');
  await updatedPost.populate('category', 'name slug');

  res.status(200).json({
    success: true,
    data: updatedPost,
  });
});

// =================================================================
// 5. DELETE POST
// =================================================================
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is the author
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});