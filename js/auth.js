/**
 * Authentication Module for DRM Protected Videos
 * Modern JavaScript (ES6+) implementation with JWT handling
 */

// Configuration
const API_URL = '/api'; // Use relative URL for same-origin requests

class Auth {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.tokenExpiry = localStorage.getItem('token_expiry');
    
    // Check if token is about to expire and refresh if needed
    this.checkTokenExpiration();
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} remember - Remember user
   * @returns {Promise} - Auth result
   */
  async login(email, password, remember = false) {
    try {
      // In a real implementation, this would be a fetch request to your backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store auth data
      this.token = data.token;
      this.user = data.user;
      this.tokenExpiry = data.expiry;
      
      // Save to localStorage or sessionStorage based on remember preference
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('auth_token', this.token);
      storage.setItem('user', JSON.stringify(this.user));
      storage.setItem('token_expiry', this.tokenExpiry);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout() {
    this.token = null;
    this.user = null;
    this.tokenExpiry = null;
    
    // Clear storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token_expiry');
    
    // Redirect to login page
    window.location.href = '/login.html';
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!this.token && new Date(this.tokenExpiry) > new Date();
  }

  /**
   * Get auth token for API requests
   * @returns {string|null} - JWT token
   */
  getToken() {
    return this.token;
  }

  /**
   * Check token expiration and refresh if needed
   */
  async checkTokenExpiration() {
    if (!this.token || !this.tokenExpiry) return;
    
    const expiry = new Date(this.tokenExpiry);
    const now = new Date();
    const timeToExpiry = expiry - now;
    
    // If token expires in less than 15 minutes, refresh it
    if (timeToExpiry > 0 && timeToExpiry < 15 * 60 * 1000) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, log out the user
        this.logout();
      }
    }
  }

  /**
   * Refresh the auth token
   * @returns {Promise} - Token refresh result
   */
  async refreshToken() {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      
      // Update token data
      this.token = data.token;
      this.tokenExpiry = data.expiry;
      
      // Update storage
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('token_expiry', this.tokenExpiry);
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
}

// Initialize auth instance
const auth = new Auth();

// DOM Interactions - Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // UI interaction for login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember')?.checked || false;
      const errorMessage = document.getElementById('error-message');
      
      try {
        // Use actual API call for production
        await auth.login(email, password, remember);
        window.location.href = '/index.html'; // Redirect to home after login
      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
      }
    });
  }
  
  // Password toggle visibility
  const togglePassword = document.getElementById('toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const icon = togglePassword.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  }
});

// Mock login function for demo purposes - remove in production
async function mockLogin(email, password, remember) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'Password123!') {
        const mockData = {
          token: 'mock_jwt_token',
          user: { id: 1, name: 'Demo User', email: 'demo@example.com' },
          expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        };
        
        localStorage.setItem('auth_token', mockData.token);
        localStorage.setItem('user', JSON.stringify(mockData.user));
        localStorage.setItem('token_expiry', mockData.expiry);
        
        resolve(mockData);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000); // Simulate API delay
  });
}

// Export auth instance
export default auth;