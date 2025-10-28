// server/server.js (Add the path and the static middleware)

import express from "express";
import path from 'path'; // <-- NEW IMPORT
// ... other imports

// ... dotenv.config()

const app = express();

// ... Middleware (express.json(), cors(), morgan())

// ------------------------------------
// Static Folder Setup (Makes uploads public)
// ------------------------------------
// Resolve the current directory name
const __dirname = path.resolve(); 
// Serve files from the 'server/uploads' directory at the '/uploads' URL path
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads'))); 
// ------------------------------------

// ... API ROUTES

// ... ERROR HANDLING MIDDLEWARE

// ... MongoDB connection and app.listen