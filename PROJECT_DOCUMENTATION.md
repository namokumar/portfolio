# Portfolio with DRM-Protected Videos - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [What Was Created](#what-was-created)
3. [Architecture Breakdown](#architecture-breakdown)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Bugs and Issues Encountered](#bugs-and-issues-encountered)
6. [How Problems Were Fixed](#how-problems-were-fixed)
7. [Configuration Details](#configuration-details)
8. [Code Explanation for Beginners](#code-explanation-for-beginners)
9. [Future Modifications Guide](#future-modifications-guide)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What This Project Does
This is a portfolio website that includes:
- **User authentication system** (signup/login)
- **DRM-protected video content** (videos only authenticated users can watch)
- **Modern web application** with Node.js backend and vanilla JavaScript frontend
- **Local MongoDB database** for storing user information
- **JWT-based security** for protecting routes and content

### Technology Stack
- **Frontend**: HTML5, CSS3, Modern JavaScript (ES6+), Tailwind CSS
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB (local installation)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **DRM Service**: Bitmovin (for video protection)
- **Development Tools**: Nodemon for auto-restarting server

---

## What Was Created

### File Structure Created
```
portfolio/
├── backend/                     # Node.js backend server
│   ├── controllers/             # Business logic handlers
│   │   ├── auth.js             # Authentication logic (login, signup, tokens)
│   │   └── drm.js              # DRM video handling logic
│   ├── middleware/             # Express middleware functions
│   │   └── auth.js             # JWT token verification middleware
│   ├── models/                 # Database schemas
│   │   └── User.js             # User data model with MongoDB schema
│   ├── routes/                 # API endpoint definitions
│   │   ├── auth.js             # Authentication routes (/api/auth/*)
│   │   └── drm.js              # DRM video routes (/api/drm/*)
│   ├── .env                    # Environment variables (secrets, config)
│   ├── package.json            # Node.js dependencies and scripts
│   └── server.js               # Main server file (entry point)
├── css/
│   ├── auth.css                # Styling for login/signup pages
│   ├── infiniteScroll.css      # (existing) Carousel animations
│   └── style.css               # (existing) Main website styles
├── js/
│   ├── auth.js                 # Frontend authentication logic
│   ├── signup.js               # Signup form validation and API calls
│   ├── protected.js            # DRM video player integration
│   └── script.js               # (updated) Main frontend logic
├── login.html                  # User login page
├── signup.html                 # User registration page
├── protected-videos.html       # DRM-protected video content page
├── index.html                  # (existing) Main portfolio page
└── README.md                   # Setup instructions
```

### New Pages Created
1. **login.html**: Professional login form with password visibility toggle
2. **signup.html**: Registration form with real-time password strength validation
3. **protected-videos.html**: Page displaying DRM-protected video content

### Backend API Endpoints Created
```
Authentication Endpoints:
- POST /api/auth/register    # Create new user account
- POST /api/auth/login       # Authenticate user and get JWT token
- GET  /api/auth/me          # Get current user information
- GET  /api/auth/logout      # Logout user and clear cookies
- POST /api/auth/refresh     # Refresh JWT token

DRM Video Endpoints:
- GET  /api/drm/videos       # Get list of all protected videos
- GET  /api/drm/videos/:id   # Get specific video metadata and DRM info
- POST /api/drm/license/widevine   # Get Widevine DRM license
- POST /api/drm/license/playready  # Get PlayReady DRM license
- POST /api/drm/license/fairplay   # Get FairPlay DRM license
- GET  /api/drm/fairplay-cert      # Get FairPlay certificate
```

---

## Architecture Breakdown

### How Authentication Works
1. **User Registration**: 
   - User fills signup form → Frontend sends POST to `/api/auth/register`
   - Backend validates data → Encrypts password with bcrypt → Saves to MongoDB
   - Returns success message → Redirects to login page

2. **User Login**:
   - User enters credentials → Frontend sends POST to `/api/auth/login`
   - Backend checks email exists → Compares password with bcrypt → Generates JWT token
   - Returns JWT token → Frontend stores in localStorage → User is logged in

3. **Protected Routes**:
   - Every protected API call includes JWT token in Authorization header
   - Backend middleware verifies token → Extracts user info → Allows access

### How DRM Protection Works
1. **Video Request**: User clicks play button on protected video
2. **Authentication Check**: Frontend verifies user has valid JWT token
3. **Metadata Request**: Frontend requests video metadata from `/api/drm/videos/:id`
4. **License Request**: Video player requests DRM license from appropriate endpoint
5. **Content Decryption**: DRM system decrypts video content for playback

### Database Schema
```javascript
User Schema:
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed with bcrypt),
  role: String (user/premium/admin),
  subscription: {
    type: String (free/basic/premium),
    expiresAt: Date
  },
  createdAt: Date
}
```

---

## Step-by-Step Implementation

### Phase 1: Project Setup
1. **Created backend directory structure**
2. **Initialized Node.js project** with `npm init`
3. **Added dependencies** in package.json
4. **Created environment configuration** (.env file)
5. **Set up MongoDB connection** using Mongoose

### Phase 2: Authentication System
1. **Created User model** with Mongoose schema
2. **Built authentication controller** with registration and login logic
3. **Implemented JWT middleware** for route protection
4. **Created auth routes** for API endpoints
5. **Built login and signup HTML pages**
6. **Created frontend JavaScript** for form handling and API communication

### Phase 3: DRM Integration
1. **Created DRM controller** for video metadata and license handling
2. **Built protected video page** with video cards display
3. **Integrated Bitmovin player** for DRM-protected content
4. **Created DRM routes** for license server functionality
5. **Connected frontend to backend** for video playback

### Phase 4: Integration and Testing
1. **Connected all components** together
2. **Fixed CORS and API endpoint** issues
3. **Tested user registration and login** flows
4. **Verified protected route** access control

---

## Bugs and Issues Encountered

### Issue #1: Package Installation Failures
**Problem**: 
```
npm error 404 Not Found - GET https://registry.npmjs.org/bitmovin-api-sdk
```

**Root Cause**: Incorrect package names in package.json
- Used `bitmovin-player` instead of `@bitmovin/player`
- Used `bitmovin-api-sdk` instead of `@bitmovin/api-sdk`

**What Happened**: NPM couldn't find packages with those exact names

### Issue #2: MongoDB Service Not Found
**Problem**:
```
Unit mongodb.service could not be found
```

**Root Cause**: Different Linux distributions use different service names
- Ubuntu uses `mongod.service` not `mongodb.service`

**What Happened**: System couldn't find the MongoDB service to check status

### Issue #3: CORS Configuration Mismatch
**Problem**: Frontend couldn't connect to backend API

**Root Cause**: CLIENT_URL was set to port 3000 but server was running on port 5000

**What Happened**: Cross-origin requests were being blocked

### Issue #4: Mock Authentication vs Real API
**Problem**: Login always failed with "Invalid credentials"

**Root Cause**: Frontend was using mock authentication functions instead of real API calls

**What Happened**: Fake authentication only accepted hardcoded demo credentials

### Issue #5: ES Modules Configuration
**Problem**: Backend couldn't use import/export syntax

**Root Cause**: Missing `"type": "module"` in package.json

**What Happened**: Node.js defaulted to CommonJS instead of ES modules

---

## How Problems Were Fixed

### Fix #1: Package Installation
**Solution Applied**:
1. Removed problematic Bitmovin packages from package.json
2. Used CDN version of Bitmovin player instead
3. Kept essential packages only for core functionality

**Code Change**:
```json
// Before (broken):
"bitmovin-player": "^8.114.0",
"bitmovin-api-sdk": "^1.139.0"

// After (working):
// Removed these packages, use CDN in HTML instead
```

### Fix #2: MongoDB Service
**Solution Applied**:
1. Checked for correct service name with `systemctl status mongod`
2. Confirmed MongoDB was running properly
3. Used correct connection string format

**Command Used**:
```bash
sudo systemctl status mongod    # Correct service name
```

### Fix #3: CORS Configuration
**Solution Applied**:
1. Updated CLIENT_URL in .env from port 3000 to 5000
2. Ensured CORS settings matched server port

**Code Change**:
```env
# Before:
CLIENT_URL=http://localhost:3000

# After:
CLIENT_URL=http://localhost:5000
```

### Fix #4: Real API Integration
**Solution Applied**:
1. Updated auth.js to use real API endpoints instead of mock functions
2. Changed API_URL from external URL to relative path
3. Connected signup.js to real registration endpoint

**Code Change**:
```javascript
// Before (broken):
const API_URL = 'https://api.example.com';
await mockLogin(email, password, remember);

// After (working):
const API_URL = '/api';
await auth.login(email, password, remember);
```

### Fix #5: ES Modules
**Solution Applied**:
1. Added `"type": "module"` to package.json
2. Used ES6 import/export syntax throughout backend
3. Updated all requires to imports

**Code Change**:
```json
{
  "type": "module"  // Added this line
}
```

---

## Configuration Details

### Environment Variables Explained
```env
# Server Configuration
PORT=5000                                    # Port where backend server runs
NODE_ENV=development                         # Environment mode

# Database Configuration  
MONGODB_URI=mongodb://localhost:27017/portfolio_drm   # Local MongoDB connection

# JWT Security
JWT_SECRET=super_secret_jwt_key_change_this_in_production_but_fine_for_testing
JWT_EXPIRE=7d                               # Token expires in 7 days
JWT_COOKIE_EXPIRE=7                         # Cookie expires in 7 days

# DRM Service (Test Values)
BITMOVIN_API_KEY=test-api-key               # Bitmovin API key
BITMOVIN_PLAYER_LICENSE=test-player-license # Bitmovin player license

# DRM License Servers (Test URLs)
DRM_KEY_ID=test_drm_key_id
DRM_KEY=test_drm_encryption_key
DRM_WIDEVINE_LICENSE_URL=https://cwip-shaka-proxy.appspot.com/no_auth
DRM_PLAYREADY_LICENSE_URL=https://test.playready.microsoft.com/service/rightsmanager.asmx
DRM_FAIRPLAY_LICENSE_URL=https://fps.ezdrm.com/api/licenses/

# CORS Settings
CLIENT_URL=http://localhost:5000            # Frontend URL for CORS
```

### Package.json Dependencies Explained
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",           // Password hashing and verification
    "cors": "^2.8.5",               // Cross-Origin Resource Sharing
    "dotenv": "^16.3.1",            // Environment variable loading
    "express": "^4.18.2",           // Web framework for Node.js
    "express-validator": "^7.0.1",   // Input validation middleware
    "jsonwebtoken": "^9.0.2",       // JWT token creation and verification
    "mongoose": "^7.5.0",           // MongoDB object modeling
    "axios": "^1.5.0",              // HTTP client for API calls
    "uuid": "^9.0.0"                // Unique ID generation
  },
  "devDependencies": {
    "nodemon": "^3.0.1",            // Auto-restart server on file changes
    "jest": "^29.6.4"               // Testing framework
  }
}
```

---

## Code Explanation for Beginners

### Understanding server.js (Main Entry Point)
```javascript
import express from 'express';        // Web framework
import cors from 'cors';              // Allow cross-origin requests
import mongoose from 'mongoose';      // MongoDB connection
import dotenv from 'dotenv';          // Load environment variables

dotenv.config();                     // Read .env file
const app = express();               // Create Express application

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Middleware (functions that run on every request)
app.use(express.json());             // Parse JSON request bodies
app.use(cors({                       // Allow frontend to connect
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Routes (define what happens for different URLs)
app.use('/api/auth', authRoutes);    // Authentication endpoints
app.use('/api/drm', drmRoutes);      // DRM video endpoints

// Start server listening on specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Understanding User.js (Database Model)
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define what a user looks like in the database
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],    // Must provide name
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,                             // No duplicate emails
    match: [/^\w+@\w+\.\w{2,3}$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false                             // Don't return password in queries
  }
});

// Before saving user, encrypt the password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);      // Create random salt
  this.password = await bcrypt.hash(this.password, salt);  // Hash password
  next();
});

// Method to create JWT token for user
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },        // Payload (user info)
    process.env.JWT_SECRET,                   // Secret key
    { expiresIn: process.env.JWT_EXPIRE }     // Expiration time
  );
};

// Method to check if entered password matches stored password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### Understanding auth.js Controller (Business Logic)
```javascript
// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;  // Extract data from request
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user (password gets hashed automatically)
    user = await User.create({ name, email, password });
    
    // Send success response with token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Send success response with token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();     // Create JWT token
  
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true                            // Cookie not accessible via JavaScript
  };
  
  user.password = undefined;                  // Remove password from response
  
  res.status(statusCode)
     .cookie('token', token, options)         // Set HTTP-only cookie
     .json({ success: true, token, user });   // Send JSON response
};
```

### Understanding Frontend auth.js (Client-Side Logic)
```javascript
class Auth {
  constructor() {
    // Get stored authentication data from browser
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.tokenExpiry = localStorage.getItem('token_expiry');
  }
  
  // Login method
  async login(email, password, remember = false) {
    try {
      // Send login request to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store authentication data in browser
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && new Date(this.tokenExpiry) > new Date();
  }
}
```

### Understanding Middleware (Security Layer)
```javascript
// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;
  
  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();  // Continue to next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
```

---

## Future Modifications Guide

### Adding New User Roles
**To add a new user role (e.g., "moderator"):**

1. **Update User model** (models/User.js):
```javascript
role: {
  type: String,
  enum: ['user', 'premium', 'admin', 'moderator'],  // Add moderator
  default: 'user'
}
```

2. **Update access control** (models/User.js):
```javascript
UserSchema.methods.hasAccessTo = function(contentType) {
  if (this.role === 'moderator') {
    // Define what moderators can access
    return contentType !== 'admin-only';
  }
  // ... existing logic
};
```

3. **Update middleware** (middleware/auth.js):
```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized for this role' });
    }
    next();
  };
};
```

### Adding New Video Categories
**To add video categories (e.g., "tutorials", "demos"):**

1. **Update video metadata** (controllers/drm.js):
```javascript
function getVideoDataById(videoId) {
  const videos = {
    'tutorial-1': {
      id: 'tutorial-1',
      title: 'Tutorial Video',
      category: 'tutorial',        // Add category
      description: '...',
      // ... other properties
    }
  };
}
```

2. **Add category filtering** (controllers/drm.js):
```javascript
export const getVideosByCategory = async (req, res) => {
  const { category } = req.params;
  
  // Filter videos by category
  const videos = getAllVideos().filter(video => video.category === category);
  
  res.json({ success: true, data: videos });
};
```

3. **Add new route** (routes/drm.js):
```javascript
router.get('/videos/category/:category', checkContentAccess('drm'), getVideosByCategory);
```

### Adding Email Verification
**To add email verification for new users:**

1. **Update User model** (models/User.js):
```javascript
const UserSchema = new mongoose.Schema({
  // ... existing fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date
});
```

2. **Update registration controller** (controllers/auth.js):
```javascript
import crypto from 'crypto';

export const register = async (req, res) => {
  // ... existing code
  
  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  await user.save();
  
  // Send verification email (implement email service)
  // sendVerificationEmail(user.email, verificationToken);
  
  res.json({ message: 'Registration successful. Please check your email.' });
};
```

### Adding Real-Time Features with WebSockets
**To add real-time notifications:**

1. **Install Socket.io**:
```bash
npm install socket.io
```

2. **Update server.js**:
```javascript
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

3. **Add to frontend**:
```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
  
  socket.on('notification', (data) => {
    // Handle real-time notifications
    showNotification(data.message);
  });
</script>
```

### Switching to MongoDB Atlas (Cloud Database)
**To use cloud database instead of local:**

1. **Create MongoDB Atlas account** at https://www.mongodb.com/atlas
2. **Create cluster and get connection string**
3. **Update .env file**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio_drm?retryWrites=true&w=majority
```

### Adding Real Bitmovin DRM
**To implement actual DRM protection:**

1. **Sign up for Bitmovin** at https://bitmovin.com/
2. **Get API key and player license**
3. **Update .env with real credentials**:
```env
BITMOVIN_API_KEY=your-real-api-key
BITMOVIN_PLAYER_LICENSE=your-real-player-license
```

4. **Encode videos with DRM**:
```javascript
// Use Bitmovin API to encode videos with DRM protection
const encoding = await bitmovin.encoding.encodings.create({
  name: 'DRM Protected Video',
  // ... encoding configuration
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot connect to MongoDB"
**Symptoms**: Server fails to start with MongoDB connection error

**Solutions**:
1. **Check if MongoDB is running**:
   ```bash
   sudo systemctl status mongod
   ```

2. **Start MongoDB if not running**:
   ```bash
   sudo systemctl start mongod
   ```

3. **Check connection string** in .env file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio_drm
   ```

#### Issue: "JWT token is invalid"
**Symptoms**: Login works but protected routes return 401 Unauthorized

**Solutions**:
1. **Check if JWT_SECRET is set** in .env
2. **Verify token is being sent** in Authorization header
3. **Check token format**:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`  // Must include "Bearer "
   }
   ```

#### Issue: "CORS policy error"
**Symptoms**: Browser console shows CORS errors when making API calls

**Solutions**:
1. **Check CLIENT_URL** matches frontend URL in .env
2. **Verify CORS configuration** in server.js:
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

#### Issue: "Port already in use"
**Symptoms**: Server fails to start with "EADDRINUSE" error

**Solutions**:
1. **Find process using port**:
   ```bash
   lsof -i :5000
   ```

2. **Kill process**:
   ```bash
   kill -9 <PID>
   ```

3. **Or change port** in .env:
   ```env
   PORT=5001
   ```

#### Issue: "Password validation failed"
**Symptoms**: Signup fails with password requirements error

**Solutions**:
1. **Check password requirements** in User model
2. **Ensure password meets criteria**:
   - At least 8 characters
   - Contains uppercase letter
   - Contains lowercase letter
   - Contains number
   - Contains special character

#### Issue: "Videos not loading"
**Symptoms**: Protected videos page shows but videos don't play

**Solutions**:
1. **Check if user is authenticated**
2. **Verify DRM credentials** in .env
3. **Check browser console** for errors
4. **Test with simpler video** (non-DRM) first

### Development Tips

#### For Debugging Authentication
1. **Add logging** to auth controller:
   ```javascript
   console.log('Login attempt:', { email, password });
   console.log('User found:', user);
   console.log('Password match:', isMatch);
   ```

2. **Check JWT token contents**:
   ```javascript
   import jwt from 'jsonwebtoken';
   const decoded = jwt.decode(token);
   console.log('Token contents:', decoded);
   ```

#### For Testing API Endpoints
Use tools like Postman or curl:
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123!"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

#### For Database Inspection
Use MongoDB shell commands:
```bash
# Connect to database
mongosh

# Switch to project database
use portfolio_drm

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find user by email
db.users.findOne({email: "test@example.com"})
```

---

## Security Best Practices

### Production Deployment Checklist
1. **Change JWT_SECRET** to a strong, random value
2. **Use HTTPS** for all communications
3. **Set secure cookie options**:
   ```javascript
   const options = {
     httpOnly: true,
     secure: true,      // HTTPS only
     sameSite: 'strict' // CSRF protection
   };
   ```

4. **Add rate limiting**:
   ```bash
   npm install express-rate-limit
   ```

5. **Validate all inputs** with express-validator
6. **Use environment variables** for all secrets
7. **Enable MongoDB authentication**
8. **Set up proper CORS** for production domain

### Code Security Guidelines
1. **Never log passwords** or sensitive data
2. **Always hash passwords** before storing
3. **Validate JWT tokens** on every protected route
4. **Use parameterized queries** to prevent injection
5. **Sanitize user inputs** before processing
6. **Set appropriate HTTP headers** for security

---

## Performance Optimization

### Backend Optimization
1. **Use connection pooling** for MongoDB
2. **Implement caching** for frequently accessed data
3. **Add database indexing**:
   ```javascript
   UserSchema.index({ email: 1 });  // Index on email field
   ```

4. **Use compression middleware**:
   ```bash
   npm install compression
   ```

### Frontend Optimization
1. **Lazy load video content**
2. **Implement proper caching** for API responses
3. **Optimize image sizes** and formats
4. **Minify CSS and JavaScript** for production
5. **Use CDN** for static assets

---

This documentation provides a complete guide for understanding, maintaining, and extending the DRM-protected portfolio website. Keep this file updated as you make changes to the project, and refer to it whenever you need to understand how any part of the system works.