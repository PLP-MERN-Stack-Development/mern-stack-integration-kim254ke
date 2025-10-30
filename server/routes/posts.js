const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // <-- NEW: Import the upload middleware

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);

// Protected routes (require a logged-in user)
// POST: Use 'upload' middleware to handle file upload before the controller
router.post('/', protect, upload, postController.createPost);

// PUT: Use 'upload' middleware to handle file upload before the controller
router.put('/:id', protect, upload, postController.updatePost);

// DELETE
router.delete('/:id', protect, postController.deletePost);

module.exports = router;
