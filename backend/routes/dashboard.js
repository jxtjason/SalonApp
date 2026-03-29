const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Admin-only dashboard routes
router.get('/stats', authenticateToken, requireRole('admin'), dashboardController.getStats);
router.get('/revenue', authenticateToken, requireRole('admin'), dashboardController.getRevenueStats);

module.exports = router;
