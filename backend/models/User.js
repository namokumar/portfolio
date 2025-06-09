import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  subscription: {
    type: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has access to specific content
UserSchema.methods.hasAccessTo = function(contentType) {
  // Free users can access basic content
  if (contentType === 'basic') return true;
  
  // Premium content check
  if (contentType === 'premium') {
    if (this.role === 'admin') return true;
    if (this.subscription.type === 'premium') {
      // Check if subscription is still valid
      if (!this.subscription.expiresAt) return true;
      return new Date() < new Date(this.subscription.expiresAt);
    }
    return false;
  }
  
  // DRM content check (most restricted)
  if (contentType === 'drm') {
    if (this.role === 'admin') return true;
    if (this.subscription.type === 'premium') {
      // Check if subscription is still valid
      if (!this.subscription.expiresAt) return true;
      return new Date() < new Date(this.subscription.expiresAt);
    }
    return false;
  }
  
  return false;
};

export default mongoose.model('User', UserSchema);