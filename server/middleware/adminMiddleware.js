// server/middleware/adminMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to check if user is authenticated and is an admin
export const requireAdmin = async (req, res, next) => {
  try {
    // First, check if user is authenticated (token exists)
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, no token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, user not found" 
      });
    }

    // Check if user is admin or super user
    if (!user.isAdmin()) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, token failed" 
    });
  }
};

// Optional: Middleware to check ownership or admin
export const requireOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized" 
      });
    }

    // If admin, allow access
    if (req.user.isAdmin()) {
      return next();
    }

    // Check if user owns the resource (must be set in route)
    const resourceOwnerId = req.resourceOwnerId; // Set this in your route handler
    
    if (resourceOwnerId && resourceOwnerId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ 
      success: false,
      message: "Access denied" 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};