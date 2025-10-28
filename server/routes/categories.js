import express from 'express';
import { body, validationResult } from 'express-validator';
import categoryController from '../controllers/categoryController.js'; // Note the .js extension

const router = express.Router();

// Middleware to handle validation results before calling the controller
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/categories - Get all categories
router.get('/', categoryController.getCategories);

// POST /api/categories - Create a new category
router.post(
  '/',
  [ 
    // Validation rules
    body('name')
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
    body('slug')
        .notEmpty().withMessage('Slug is required.')
  ],
  handleValidationErrors, // Run validation check middleware
  categoryController.createCategory // Call the controller function
);

export default router;
