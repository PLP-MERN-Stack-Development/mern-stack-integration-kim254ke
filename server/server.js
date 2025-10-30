import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import userRoutes from './routes/userRoutes.js'; 
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categories.js'; 
import commentRoutes from './routes/comments.js'; 
import { errorHandler, notFound } from './middleware/errorMiddleware.js'; 

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Database Connection ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// --- 2. Middleware Setup ---
// Enable CORS for frontend connection
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json()); 
// Middleware to parse form data (for posts with images)
app.use(express.urlencoded({ extended: true })); 

// Make the 'uploads' folder publicly accessible
const __dirname = path.resolve(); 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- 3. Route Definitions ---
// User authentication and registration routes
app.use('/api/auth', userRoutes);
// Blog post routes
app.use('/api/posts', postRoutes); 
// Category management routes
app.use('/api/categories', categoryRoutes);
// Comment routes
app.use('/api/comments', commentRoutes);

// Basic status check for the root path
app.get('/', (req, res) => {
    res.send(`API is running on port ${PORT}...`);
});

// --- 4. Error Middleware ---
// Custom 404 handler for routes not found
app.use(notFound);
// General error handler (must be last middleware)
app.use(errorHandler);

// --- 5. Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));