# Portfolio with DRM-Protected Videos

This portfolio website includes authentication and DRM-protected video content using Node.js backend and Bitmovin for DRM services.

## Project Structure

- `portfolio/` - Frontend files
  - `css/` - Stylesheets
  - `js/` - JavaScript files
  - `assets/` - Images and other assets
  - `index.html` - Main portfolio page
  - `login.html` - Authentication page
  - `signup.html` - Registration page
  - `protected-videos.html` - DRM protected videos page

- `portfolio/backend/` - Node.js backend
  - `models/` - Database models
  - `controllers/` - Route controllers
  - `middleware/` - Middleware functions
  - `routes/` - API routes
  - `server.js` - Main server file

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Bitmovin account (free tier available)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd portfolio/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Rename `.env.example` to `.env` 
   - Update the values with your MongoDB URI and Bitmovin credentials

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

The frontend is already set up and will be served by the Node.js backend. Just make sure the backend server is running.

## Authentication System

The authentication system uses:
- JWT (JSON Web Tokens) for secure authentication
- Password hashing with bcrypt
- MongoDB for user data storage

### Demo Login

For testing purposes, you can use:
- Email: demo@example.com
- Password: Password123!

## DRM Implementation

This project uses Bitmovin for DRM protection, which supports:
- Widevine (Chrome, Firefox, Edge, Android)
- PlayReady (Edge, Xbox)
- FairPlay (Safari, iOS)

## Customization

### Adding More Videos

To add more DRM-protected videos:
1. Add video metadata in `controllers/drm.js`
2. Upload your videos to a streaming service that supports DRM
3. Update the metadata with the correct stream URLs

### Changing Subscription Levels

Modify the `User` model in `models/User.js` to adjust subscription tiers and access levels.

## License

This project is licensed under the MIT License - see the LICENSE file for details.