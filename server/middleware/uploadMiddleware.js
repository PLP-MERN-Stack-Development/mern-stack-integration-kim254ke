import multer from 'multer';
import path from 'path'; // Node's built-in path module

// 1. Setup Storage Destination and File Naming
const storage = multer.diskStorage({
  // Define where the files should be stored (must create this folder!)
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/'); 
  },
  // Define the file name format: fieldname-timestamp.ext
  filename: (req, file, cb) => {
    // Get the original file extension
    const ext = path.extname(file.originalname);
    // Create a unique name
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// 2. Setup File Filter (Validation)
const fileFilter = (req, file, cb) => {
  // Allow only jpeg, jpg, and png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    // Reject other file types
    cb(new Error('Only JPEG, JPG, and PNG files are allowed!'), false);
  }
};

// 3. Create the upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit files to 5MB
  }
});

// We'll export the single image handler
export const uploadSingleImage = upload.single('featuredImage');