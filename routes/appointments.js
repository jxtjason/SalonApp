const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create appointment (client)
router.post('/', authenticateToken, requireRole('client'), appointmentController.create);

// Get all appointments (admin dashboard)
router.get('/', authenticateToken, requireRole('admin'), appointmentController.getAll);

// Get appointments by user (client)
router.get('/user', authenticateToken, requireRole('client'), appointmentController.getByUser);

// Get appointments by apprentice (apprentice dashboard)
router.get('/apprentice', authenticateToken, requireRole('apprentice'), appointmentController.getByApprentice);

// Cancel appointment
router.patch('/:id/cancel', authenticateToken, requireRole(['client', 'admin']), appointmentController.cancel);

// Update appointment (admin)
router.put('/:id', authenticateToken, requireRole('admin'), appointmentController.update);

module.exports = router;