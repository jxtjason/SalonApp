const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// User profile routes
router.get('/:id', authenticateToken, userProfileController.getProfile);
router.patch('/:id', authenticateToken, userProfileController.updateProfile);
router.patch('/:id/status', authenticateToken, requireRole('admin'), userProfileController.updateUserStatus);

module.exports = router;
