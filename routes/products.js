const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Admin-only routes
router.post('/', authenticateToken, requireRole('admin'), productController.create);
router.put('/:id', authenticateToken, requireRole('admin'), productController.update);
router.delete('/:id', authenticateToken, requireRole('admin'), productController.delete);

// Public route
router.get('/', productController.getAll);

module.exports = router;