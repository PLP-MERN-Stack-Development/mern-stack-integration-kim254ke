import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // ✅ use dedicated DB connection file

// --- Load environment variables ---
dotenv.config();

// --- Initialize app ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Connect to MongoDB ---
connectDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Static folder setup for uploads ---
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "server/uploads")));

// --- Routes Imports ---
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categories.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";

// --- Route Configuration ---
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// --- Root Route ---
app.get("/", (req, res) => {
  res.send("✅ Blog App Backend is running successfully...");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
