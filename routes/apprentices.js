const express = require('express');
const router = express.Router();
const apprenticeController = require('../controllers/apprenticeController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', apprenticeController.getAll);
router.get('/ratings/:apprenticeId', apprenticeController.getRatings);
router.get('/votes/:apprenticeId', apprenticeController.getVotes);

// Admin-only routes for managing apprentices
router.post('/', authenticateToken, requireRole('admin'), apprenticeController.create);
router.put('/:id', authenticateToken, requireRole('admin'), apprenticeController.update);
router.delete('/:id', authenticateToken, requireRole('admin'), apprenticeController.delete);

module.exports = router;
