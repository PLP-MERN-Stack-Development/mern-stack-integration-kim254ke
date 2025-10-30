import multer from 'multer';
import path from 'path';
import fs from 'fs';

// --- 1. Ensure the 'uploads' directory exists ---
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Created uploads directory at: ${uploadDir}`);
}

// --- 2. Define Storage Destination and Filename ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Example: post-1700000000000.jpg
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// --- 3. Define File Filter (Allow only images) ---
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// --- 4. Create Multer Instance (no file size limit) ---
export const upload = multer({
  storage,
  fileFilter,
  // 🚫 Removed size limit — upload size is unrestricted
});
