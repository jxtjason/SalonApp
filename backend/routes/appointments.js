const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { updateStatus } = require('../controllers/updateStatus');
const appointmentExtendedController = require('../controllers/appointmentExtendedController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create appointment (client)
router.post('/', authenticateToken, requireRole('client'), appointmentController.create);

// Get all appointments (admin dashboard)
router.get('/', authenticateToken, requireRole('admin'), appointmentController.getAll);

// Get appointments by user (client)
router.get('/user', authenticateToken, requireRole('client'), appointmentController.getByUser);

// Get appointments by apprentice (apprentice dashboard)
router.get('/apprentice', authenticateToken, requireRole('apprentice'), appointmentController.getByApprentice);

// Get today's appointments
router.get('/today', authenticateToken, appointmentExtendedController.getTodayAppointments);

// Get upcoming appointments
router.get('/upcoming', authenticateToken, appointmentExtendedController.getUpcomingAppointments);

// Cancel appointment
router.patch('/:id/cancel', authenticateToken, requireRole(['client', 'admin']), appointmentController.cancel);

// Update appointment (admin)
router.put('/:id', authenticateToken, requireRole('admin'), appointmentController.update);

// Update appointment status (admin and apprentice)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['admin', 'apprentice']),
  updateStatus
);

module.exports = router;