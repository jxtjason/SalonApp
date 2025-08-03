const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create a review (for client dashboard)
router.post('/', authenticateToken, requireRole('client'), reviewController.create);

// Get reviews for an apprentice (public)
router.get('/apprentice/:apprenticeId', reviewController.getByApprentice);

// Get all reviews (admin only)
router.get('/', authenticateToken, requireRole('admin'), reviewController.getAll);

// Update review (client can update their own or admin)
router.put('/:id', authenticateToken, requireRole(['client', 'admin']), reviewController.update);

// Delete review (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), reviewController.delete);

module.exports = router;
