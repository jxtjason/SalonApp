const express = require('express');
const router = express.Router();
const {
  getAllHairstyles,
  getHairstyleById,
  createHairstyle,
  updateHairstyle,
  deleteHairstyle,
  getHairstylesByCategory
} = require('../controllers/hairstyleController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllHairstyles);
router.get('/category/:category', getHairstylesByCategory);
router.get('/:id', getHairstyleById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createHairstyle);
router.put('/:id', authenticateToken, requireAdmin, updateHairstyle);
router.delete('/:id', authenticateToken, requireAdmin, deleteHairstyle);

module.exports = router;
