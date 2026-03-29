const express = require('express');
const router = express.Router();
const {
  getAllBroadcastMessages,
  getAllBroadcastMessagesAdmin,
  createBroadcastMessage,
  updateBroadcastMessage,
  deleteBroadcastMessage,
  deactivateBroadcastMessage
} = require('../controllers/broadcastMessageController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes (for clients/apprentices to see messages)
router.get('/', authenticateToken, getAllBroadcastMessages);

// Admin only routes
router.get('/admin', authenticateToken, requireAdmin, getAllBroadcastMessagesAdmin);
router.post('/', authenticateToken, requireAdmin, createBroadcastMessage);
router.put('/:id', authenticateToken, requireAdmin, updateBroadcastMessage);
router.delete('/:id', authenticateToken, requireAdmin, deleteBroadcastMessage);
router.patch('/:id/deactivate', authenticateToken, requireAdmin, deactivateBroadcastMessage);

module.exports = router;
