import express from 'express';
import {
  getAllVideos,
  getVideoMetadata,
  getWidevineLicense,
  getPlayReadyLicense,
  getFairPlayLicense,
  getFairPlayCertificate
} from '../controllers/drm.js';
import { protect, checkContentAccess } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// @route   GET /api/drm/videos
// @desc    Get all DRM protected videos
// @access  Private (requires DRM access)
router.get('/videos', checkContentAccess('drm'), getAllVideos);

// @route   GET /api/drm/videos/:videoId
// @desc    Get DRM video metadata
// @access  Private (requires DRM access)
router.get('/videos/:videoId', checkContentAccess('drm'), getVideoMetadata);

// @route   POST /api/drm/license/widevine
// @desc    Get Widevine license
// @access  Private (requires DRM access)
router.post('/license/widevine', checkContentAccess('drm'), getWidevineLicense);

// @route   POST /api/drm/license/playready
// @desc    Get PlayReady license
// @access  Private (requires DRM access)
router.post('/license/playready', checkContentAccess('drm'), getPlayReadyLicense);

// @route   POST /api/drm/license/fairplay
// @desc    Get FairPlay license
// @access  Private (requires DRM access)
router.post('/license/fairplay', checkContentAccess('drm'), getFairPlayLicense);

// @route   GET /api/drm/fairplay-cert
// @desc    Get FairPlay certificate
// @access  Private (requires DRM access)
router.get('/fairplay-cert', checkContentAccess('drm'), getFairPlayCertificate);

export default router;