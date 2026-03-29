const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/apprentices', authenticateToken, requireRole('admin'), userController.getApprentices);
router.post('/assign-booking', authenticateToken, requireRole('admin'), userController.assignBooking);

module.exports = router; 