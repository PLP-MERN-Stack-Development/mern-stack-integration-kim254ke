// server/debug.js
// Run this file to diagnose issues: node debug.js

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Diagnosing Server Setup...\n');

// 1. Check Node version
console.log('✅ Node Version:', process.version);

// 2. Check if .env exists
const envPath = join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  
  // Try to load dotenv
  try {
    await import('dotenv').then(dotenv => dotenv.config());
    console.log('✅ dotenv loaded successfully');
    
    // Check critical env variables
    if (process.env.MONGO_URI) {
      console.log('✅ MONGO_URI is set');
    } else {
      console.log('❌ MONGO_URI is missing in .env');
    }
    
    if (process.env.JWT_SECRET) {
      console.log('✅ JWT_SECRET is set');
    } else {
      console.log('❌ JWT_SECRET is missing in .env');
    }
    
    if (process.env.PORT) {
      console.log('✅ PORT is set to', process.env.PORT);
    } else {
      console.log('⚠️  PORT not set, will default to 5000');
    }
  } catch (err) {
    console.log('❌ Error loading dotenv:', err.message);
    console.log('   Run: npm install dotenv');
  }
} else {
  console.log('❌ .env file NOT FOUND');
  console.log('   Create server/.env with MONGO_URI, JWT_SECRET, and PORT');
}

// 3. Check if uploads folder exists
const uploadsPath = join(__dirname, 'uploads');
if (fs.existsSync(uploadsPath)) {
  console.log('✅ uploads/ folder found');
} else {
  console.log('❌ uploads/ folder NOT FOUND');
  console.log('   Run: mkdir server/uploads');
}

// 4. Check critical files
const criticalFiles = [
  'server.js',
  'config/db.js',
  'models/Post.js',
  'models/user.js',
  'models/Category.js',
  'routes/posts.js',
  'routes/userRoutes.js',
  'controllers/postController.js',
  'controllers/userController.js',
  'middleware/authMiddleware.js'
];

console.log('\n📁 Checking critical files:');
criticalFiles.forEach(file => {
  const filePath = join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// 5. Check package.json
const packagePath = join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('\n✅ package.json found');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (pkg.type === 'module') {
    console.log('✅ "type": "module" is set (ES modules enabled)');
  } else {
    console.log('❌ "type": "module" is missing - add it to package.json');
  }
  
  // Check dependencies
  const requiredDeps = [
    'express', 'mongoose', 'dotenv', 'cors', 'bcrypt', 
    'jsonwebtoken', 'multer', 'slugify', 'express-validator'
  ];
  
  console.log('\n📦 Checking dependencies:');
  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING (run: npm install ${dep})`);
    }
  });
} else {
  console.log('❌ package.json NOT FOUND');
}

// 6. Test MongoDB connection
console.log('\n🔌 Testing MongoDB connection...');
try {
  const mongoose = await import('mongoose');
  
  if (!process.env.MONGO_URI) {
    console.log('❌ Cannot test MongoDB - MONGO_URI not set');
  } else {
    try {
      await mongoose.default.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connection successful!');
      await mongoose.default.connection.close();
    } catch (err) {
      console.log('❌ MongoDB connection failed:', err.message);
    }
  }
} catch (err) {
  console.log('❌ mongoose not installed');
  console.log('   Run: npm install mongoose');
}

console.log('\n✨ Diagnosis complete!\n');