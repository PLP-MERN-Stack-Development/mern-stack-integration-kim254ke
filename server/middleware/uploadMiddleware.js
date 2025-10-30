// server/middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';

// --- 1. Define Storage Destination and Filename ---
const storage = multer.diskStorage({
  // Define where files should be saved (relative to the server root)
  destination(req, file, cb) {
    // NOTE: Ensure the 'uploads' directory exists in your server folder
    cb(null, 'uploads/'); 
  },
  // Define how files should be named
  filename(req, file, cb) {
    // Example: post-1700000000000.jpg
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// --- 2. Define File Filter (Optional: Only allow images) ---
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    // Pass false to reject file, and provide error later if needed
    cb(null, false); 
  }
};

// --- 3. Create Multer Instance and Export it as a NAMED EXPORT ---
export const upload = multer({
  storage,
  fileFilter,
  // Limit file size (optional, e.g., 2MB)
  limits: { fileSize: 1024 * 1024 * 2 }, 
});