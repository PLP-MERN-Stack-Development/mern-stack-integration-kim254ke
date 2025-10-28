// server/controllers/postController.js (Changes in createPost)

// ... (sendError, imports, other functions)

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  // NOTE: req.body fields are now strings due to multipart/form-data
  let { title, content, category } = req.body;
  const authorId = req.user._id;

  // 1. Get the path to the uploaded file
  // Multer saves the file path on req.file.path
  const featuredImage = req.file 
    ? req.file.path.replace(/\\/g, "/") // Replace backslashes on Windows for URL consistency
    : undefined; // Keep the default if no file was uploaded

  try {
    // 1. Validate Category Exists (same as before)
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return sendError(res, 404, 'The provided category ID does not exist.');
    }

    // 2. Generate slug and check if title/content are present
    if (!title || !content) {
        return sendError(res, 400, 'Title and Content are required.');
    }
    const slug = slugify(title, { lower: true, strict: true });

    // 3. Create the post
    const post = await Post.create({
      title,
      content,
      slug,
      category,
      author: authorId,
      featuredImage: featuredImage, // <-- NEW: Save the image path
    });

    res.status(201).json({ 
      success: true, 
      message: 'Post created successfully.', 
      data: post 
    });

  } catch (error) {
    // Handle database errors
    if (error.code === 11000) { 
        return sendError(res, 400, 'Post title/slug must be unique.');
    }
    sendError(res, 500, error.message);
  }
};

// ... (rest of the file)