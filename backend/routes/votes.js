const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Vote for best apprentice (for client dashboard)
router.post('/', authenticateToken, requireRole('client'), voteController.create);

// Get votes for an apprentice (public)
router.get('/apprentice/:apprenticeId', voteController.getByApprentice);

// Get all votes (admin only)
router.get('/', authenticateToken, requireRole('admin'), voteController.getAll);

// Update vote (client can update their own or admin)
router.put('/:id', authenticateToken, requireRole(['client', 'admin']), voteController.update);

// Delete vote (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), voteController.delete);

module.exports = router;
