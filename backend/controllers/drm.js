import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

// DRM Key Server configuration
const DRM_KEY_ID = process.env.DRM_KEY_ID;
const DRM_KEY = process.env.DRM_KEY;
const WIDEVINE_LICENSE_URL = process.env.DRM_WIDEVINE_LICENSE_URL;
const PLAYREADY_LICENSE_URL = process.env.DRM_PLAYREADY_LICENSE_URL;
const FAIRPLAY_LICENSE_URL = process.env.DRM_FAIRPLAY_LICENSE_URL;
const BITMOVIN_API_KEY = process.env.BITMOVIN_API_KEY;

// @desc    Get DRM video metadata
// @route   GET /api/drm/videos/:videoId
// @access  Private
export const getVideoMetadata = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Check if user has access to DRM content
    if (!req.user.hasAccessTo('drm')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this content. Please upgrade your subscription.'
      });
    }
    
    // In a real application, you would fetch this from a database
    // Here we're using a mock implementation
    const videoData = getVideoDataById(videoId);
    
    if (!videoData) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Enhance the video data with DRM information
    const drmInfo = {
      encrypted: true,
      drmSystems: {
        widevine: {
          licenseUrl: `${process.env.CLIENT_URL}/api/drm/license/widevine`
        },
        playready: {
          licenseUrl: `${process.env.CLIENT_URL}/api/drm/license/playready`
        },
        fairplay: {
          licenseUrl: `${process.env.CLIENT_URL}/api/drm/license/fairplay`,
          certificateUrl: `${process.env.CLIENT_URL}/api/drm/fairplay-cert`
        }
      },
      // For Bitmovin Player
      bitmovinKey: BITMOVIN_API_KEY
    };
    
    // Return the video metadata with DRM info
    res.status(200).json({
      success: true,
      data: {
        ...videoData,
        ...drmInfo
      }
    });
  } catch (error) {
    console.error('DRM video metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching video metadata'
    });
  }
};

// @desc    Get DRM license for Widevine
// @route   POST /api/drm/license/widevine
// @access  Private
export const getWidevineLicense = async (req, res) => {
  try {
    // Check if user has access to DRM content
    if (!req.user.hasAccessTo('drm')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this content'
      });
    }
    
    // Get the license request from the client
    const licenseRequest = req.body;
    
    // In a production environment, you would forward this request to a real DRM license server
    // For Bitmovin, we use their API to get a license
    const response = await axios.post(WIDEVINE_LICENSE_URL, licenseRequest, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${BITMOVIN_API_KEY}`
      }
    });
    
    // Set the appropriate headers
    res.set('Content-Type', 'application/octet-stream');
    
    // Return the license
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Widevine license error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while obtaining Widevine license'
    });
  }
};

// @desc    Get DRM license for PlayReady
// @route   POST /api/drm/license/playready
// @access  Private
export const getPlayReadyLicense = async (req, res) => {
  try {
    // Check if user has access to DRM content
    if (!req.user.hasAccessTo('drm')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this content'
      });
    }
    
    // Get the license request from the client
    const licenseRequest = req.body;
    
    // Forward to PlayReady license server
    const response = await axios.post(PLAYREADY_LICENSE_URL, licenseRequest, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${BITMOVIN_API_KEY}`
      }
    });
    
    // Set the appropriate headers
    res.set('Content-Type', 'application/octet-stream');
    
    // Return the license
    res.status(200).send(response.data);
  } catch (error) {
    console.error('PlayReady license error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while obtaining PlayReady license'
    });
  }
};

// @desc    Get DRM license for FairPlay
// @route   POST /api/drm/license/fairplay
// @access  Private
export const getFairPlayLicense = async (req, res) => {
  try {
    // Check if user has access to DRM content
    if (!req.user.hasAccessTo('drm')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this content'
      });
    }
    
    // Get the license request from the client
    const licenseRequest = req.body;
    
    // Forward to FairPlay license server
    const response = await axios.post(FAIRPLAY_LICENSE_URL, licenseRequest, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${BITMOVIN_API_KEY}`
      }
    });
    
    // Set the appropriate headers
    res.set('Content-Type', 'application/octet-stream');
    
    // Return the license
    res.status(200).send(response.data);
  } catch (error) {
    console.error('FairPlay license error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while obtaining FairPlay license'
    });
  }
};

// @desc    Get FairPlay certificate
// @route   GET /api/drm/fairplay-cert
// @access  Private
export const getFairPlayCertificate = async (req, res) => {
  try {
    // Check if user has access to DRM content
    if (!req.user.hasAccessTo('drm')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this content'
      });
    }
    
    // In a real implementation, you would fetch this from Bitmovin or your DRM provider
    // For now, we'll simulate a response
    const certUrl = `https://bitmovin.com/fairplay/certificate`;
    const response = await axios.get(certUrl, {
      headers: {
        'Authorization': `Bearer ${BITMOVIN_API_KEY}`
      }
    });
    
    // Set the appropriate headers
    res.set('Content-Type', 'application/octet-stream');
    
    // Return the certificate
    res.status(200).send(response.data);
  } catch (error) {
    console.error('FairPlay certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while obtaining FairPlay certificate'
    });
  }
};

// Helper function to get video data by ID
// In a real app, this would fetch from a database
function getVideoDataById(videoId) {
  const videos = {
    'video-1': {
      id: 'video-1',
      title: 'Corporate Promo Video',
      description: 'A premium promotional video created for a corporate client showcasing their products and services.',
      duration: 755, // in seconds
      thumbnail: 'https://via.placeholder.com/640x360',
      streamUrl: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
      type: 'application/dash+xml',
      contentType: 'drm'
    },
    'video-2': {
      id: 'video-2',
      title: 'Product Demo',
      description: 'A detailed demonstration of product features with professional motion graphics and animations.',
      duration: 522, // in seconds
      thumbnail: 'https://via.placeholder.com/640x360',
      streamUrl: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
      type: 'application/dash+xml',
      contentType: 'drm'
    },
    'video-3': {
      id: 'video-3',
      title: 'Event Highlight Reel',
      description: 'A cinematic highlight reel from a major tech conference with interviews and key moments.',
      duration: 920, // in seconds
      thumbnail: 'https://via.placeholder.com/640x360',
      streamUrl: 'https://bitmovin-a.akamaihd.net/content/sintel/sintel.mpd',
      type: 'application/dash+xml',
      contentType: 'drm'
    }
  };
  
  return videos[videoId];
}

// @desc    Get all available DRM videos
// @route   GET /api/drm/videos
// @access  Private
export const getAllVideos = async (req, res) => {
  try {
    // Check if user has access to DRM content
    if (!req.user.hasAccessTo('drm')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this content. Please upgrade your subscription.'
      });
    }
    
    // In a real application, you would fetch this from a database
    // Here we're using a mock implementation
    const videos = [
      getVideoDataById('video-1'),
      getVideoDataById('video-2'),
      getVideoDataById('video-3')
    ];
    
    // Return the videos list
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('Get all videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching videos'
    });
  }
};