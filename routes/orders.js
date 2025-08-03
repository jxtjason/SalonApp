const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create an order (for client dashboard)
router.post('/', authenticateToken, requireRole('client'), orderController.create);

// Get orders for a client
router.get('/client', authenticateToken, requireRole('client'), orderController.getByClient);

// Get all orders (admin only)
router.get('/', authenticateToken, requireRole('admin'), orderController.getAll);

// Update order status (admin only)
router.put('/:id', authenticateToken, requireRole('admin'), orderController.update);

// Cancel order (client can cancel their own)
router.patch('/:id/cancel', authenticateToken, requireRole(['client', 'admin']), orderController.cancel);

module.exports = router;
