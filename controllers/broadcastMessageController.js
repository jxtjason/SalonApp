const { BroadcastMessage, User } = require('../models');

// Get all active broadcast messages
const getAllBroadcastMessages = async (req, res) => {
  try {
    const { targetAudience } = req.query;
    const where = { isActive: true };
    
    // Filter by target audience if specified
    if (targetAudience && targetAudience !== 'all') {
      where.targetAudience = [targetAudience, 'all'];
    }
    
    // Only show non-expired messages
    where.expiresAt = {
      [require('sequelize').Op.or]: [
        null,
        { [require('sequelize').Op.gt]: new Date() }
      ]
    };
    
    const messages = await BroadcastMessage.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all broadcast messages for admin (including expired/inactive)
const getAllBroadcastMessagesAdmin = async (req, res) => {
  try {
    const messages = await BroadcastMessage.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new broadcast message (Admin only)
const createBroadcastMessage = async (req, res) => {
  try {
    const { title, message, targetAudience, priority, expiresAt } = req.body;
    const createdBy = req.user.id; // Assuming user is attached to request via auth middleware
    
    const broadcastMessage = await BroadcastMessage.create({
      title,
      message,
      targetAudience,
      priority,
      expiresAt,
      createdBy
    });
    
    // Include creator info in response
    const messageWithCreator = await BroadcastMessage.findByPk(broadcastMessage.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.status(201).json(messageWithCreator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update broadcast message (Admin only)
const updateBroadcastMessage = async (req, res) => {
  try {
    const message = await BroadcastMessage.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Broadcast message not found' });
    }
    
    await message.update(req.body);
    
    // Return updated message with creator info
    const updatedMessage = await BroadcastMessage.findByPk(message.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(updatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete broadcast message (Admin only)
const deleteBroadcastMessage = async (req, res) => {
  try {
    const message = await BroadcastMessage.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Broadcast message not found' });
    }
    
    await message.destroy();
    res.json({ message: 'Broadcast message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate broadcast message (Admin only)
const deactivateBroadcastMessage = async (req, res) => {
  try {
    const message = await BroadcastMessage.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Broadcast message not found' });
    }
    
    await message.update({ isActive: false });
    res.json({ message: 'Broadcast message deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBroadcastMessages,
  getAllBroadcastMessagesAdmin,
  createBroadcastMessage,
  updateBroadcastMessage,
  deleteBroadcastMessage,
  deactivateBroadcastMessage
};
