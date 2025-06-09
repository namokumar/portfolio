/**
 * Protected Video Module - Handles DRM video playback and authentication
 * Uses modern JavaScript with ES6+ features
 */

// Import the auth module if it exists
let auth;
try {
  import('./auth.js').then(module => {
    auth = module.default;
    checkAuthentication();
  }).catch(err => {
    console.warn('Auth module not loaded:', err);
  });
} catch (e) {
  console.warn('ES modules not supported or auth.js not found');
}

// Configuration
const API_URL = '/api';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication first
  checkAuthentication();
  
  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (auth) auth.logout();
      else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login.html';
      }
    });
  }

  // Set up video modal interaction
  setupVideoModal();
  
  // Load available videos from API
  loadAvailableVideos();
});

/**
 * Check authentication status
 */
function checkAuthentication() {
  // Skip auth check if auth module isn't loaded
  if (!auth) return;
  
  if (!auth.isAuthenticated()) {
    // Redirect to login if not authenticated
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
  }
}

/**
 * Setup video modal opening and closing
 */
function setupVideoModal() {
  const videoModal = document.getElementById('video-modal');
  const closeModal = document.getElementById('close-modal');
  const videoContainer = document.getElementById('video-container');
  
  // Get all play buttons and watch now buttons
  const playButtons = document.querySelectorAll('.aspect-video button');
  const watchButtons = document.querySelectorAll('.watch-video-btn');
  
  // Function to handle video playing
  const playVideo = (videoId) => {
    // Show modal
    videoModal.classList.remove('hidden');
    videoModal.style.display = 'flex';
    
    // Load the video with DRM protection
    loadProtectedVideo(videoId, videoContainer);
  };
  
  // Add click event to each play button
  playButtons.forEach((button) => {
    // Skip locked videos
    if (button.parentElement.querySelector('.fa-lock')) return;
    
    button.addEventListener('click', () => {
      const videoCard = button.closest('[data-video-id]');
      if (videoCard) {
        const videoId = videoCard.dataset.videoId;
        playVideo(videoId);
      }
    });
  });
  
  // Add click event to each "Watch Now" button
  watchButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const videoCard = button.closest('[data-video-id]');
      if (videoCard) {
        const videoId = videoCard.dataset.videoId;
        playVideo(videoId);
      }
    });
  });
  
  // Close modal handler
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      videoModal.classList.add('hidden');
      videoModal.style.display = 'none';
      // Stop the video
      videoContainer.innerHTML = '<p class="text-white text-center">Loading secured video player...</p>';
    });
  }
}

/**
 * Load available videos from the API
 */
async function loadAvailableVideos() {
  try {
    // Get auth token
    const token = auth ? auth.getToken() : localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Show loading state
    const videoGrid = document.querySelector('.grid');
    if (videoGrid) {
      videoGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading videos...</p>
        </div>
      `;
    }
    
    // Fetch videos from API
    const response = await fetch(`${API_URL}/drm/videos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
      }
      throw new Error('Failed to fetch videos');
    }
    
    const result = await response.json();
    
    // Render videos
    if (videoGrid && result.data && result.data.length > 0) {
      videoGrid.innerHTML = '';
      
      result.data.forEach(video => {
        const duration = formatDuration(video.duration);
        
        videoGrid.innerHTML += `
          <div class="bg-white rounded-xl overflow-hidden shadow-md" data-video-id="${video.id}">
            <div class="relative aspect-video bg-purple-100">
              <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover" />
              <button class="absolute inset-0 flex items-center justify-center bg-purple-900/30 hover:bg-purple-900/50 transition-all">
                <i class="fas fa-play text-white text-4xl"></i>
              </button>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg mb-2">${video.title}</h3>
              <p class="text-gray-600 text-sm">${video.description}</p>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500">${duration}</span>
                <button class="text-purple-600 hover:text-purple-800 font-medium watch-video-btn">Watch Now</button>
              </div>
            </div>
          </div>
        `;
      });
      
      // Re-attach event listeners
      setupVideoModal();
    } else if (videoGrid) {
      videoGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-film text-purple-300 text-5xl mb-4"></i>
          <p class="text-gray-600">No videos available</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    const videoGrid = document.querySelector('.grid');
    if (videoGrid) {
      videoGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
          <p class="text-gray-600">Failed to load videos</p>
          <p class="text-sm text-gray-500 mt-2">${error.message}</p>
        </div>
      `;
    }
  }
}

/**
 * Format duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Load a DRM-protected video
 * @param {string} videoId - The ID of the video to load
 * @param {HTMLElement} container - The container element for the video
 */
async function loadProtectedVideo(videoId, container) {
  try {
    // Show loading state
    container.innerHTML = `<div class="text-white text-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p>Loading protected video...</p>
    </div>`;
    
    // Fetch video metadata from our backend
    const videoMetadata = await fetchVideoMetadata(videoId);
    
    if (!videoMetadata) {
      throw new Error('Could not load video metadata');
    }
    
    // Initialize Bitmovin Player
    const playerConfig = {
      key: videoMetadata.bitmovinKey
    };
    
    // Create Bitmovin player container
    container.innerHTML = '';
    const playerContainer = document.createElement('div');
    playerContainer.id = `bitmovin-player-${videoId}`;
    playerContainer.className = 'w-full h-full';
    container.appendChild(playerContainer);
    
    // Load Bitmovin Player script if not already loaded
    await loadBitmovinPlayerScript();
    
    // Create player instance
    const player = new window.bitmovin.player.Player(playerContainer, playerConfig);
    
    // Configure DRM source
    const sourceConfig = {
      dash: videoMetadata.streamUrl,
      drm: {
        widevine: {
          LA_URL: videoMetadata.drmSystems.widevine.licenseUrl,
          headers: {
            'Authorization': `Bearer ${auth ? auth.getToken() : localStorage.getItem('auth_token')}`
          }
        },
        playready: {
          LA_URL: videoMetadata.drmSystems.playready.licenseUrl,
          headers: {
            'Authorization': `Bearer ${auth ? auth.getToken() : localStorage.getItem('auth_token')}`
          }
        }
      }
    };
    
    // Add FairPlay if on Safari
    if (videoMetadata.drmSystems.fairplay && isSafari()) {
      sourceConfig.drm.fairplay = {
        LA_URL: videoMetadata.drmSystems.fairplay.licenseUrl,
        certificateURL: videoMetadata.drmSystems.fairplay.certificateUrl,
        headers: {
          'Authorization': `Bearer ${auth ? auth.getToken() : localStorage.getItem('auth_token')}`
        }
      };
    }
    
    // Load source
    player.load(sourceConfig).then(() => {
      console.log('Bitmovin player loaded successfully');
      player.play();
    }).catch(error => {
      console.error('Error loading Bitmovin player:', error);
      container.innerHTML = `<div class="text-white text-center p-8">
        <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
        <p>Sorry, there was an error loading this video.</p>
        <p class="text-sm text-gray-400 mt-2">Error: ${error.message}</p>
      </div>`;
    });
  } catch (error) {
    console.error('Error loading protected video:', error);
    container.innerHTML = `<div class="text-white text-center p-8">
      <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
      <p>Sorry, there was an error loading this video.</p>
      <p class="text-sm text-gray-400 mt-2">Error: ${error.message}</p>
    </div>`;
  }
}

/**
 * Load Bitmovin Player script
 * @returns {Promise} - Resolves when script is loaded
 */
function loadBitmovinPlayerScript() {
  return new Promise((resolve, reject) => {
    if (window.bitmovin) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Check if browser is Safari
 * @returns {boolean} - True if Safari
 */
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// No replacement - deleting these functions as they're no longer needed with Bitmovin Player

/**
 * Fetch video metadata from server
 * @param {string} videoId - The ID of the video
 * @returns {Promise<Object>} - Video metadata
 */
async function fetchVideoMetadata(videoId) {
  try {
    // Get auth token
    const token = auth ? auth.getToken() : localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Fetch from our backend API
    const response = await fetch(`${API_URL}/drm/videos/${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Redirect to login if unauthorized
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return null;
      }
      throw new Error('Failed to fetch video metadata');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}

// Export any functions or objects that need to be accessed from other modules
export { loadProtectedVideo };