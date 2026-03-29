const User = require('../models/User');

// Get user profile by ID
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, bio } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ name: username, bio });
    
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user status (admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ isActive });
    
    res.json({ 
      success: true, 
      message: 'User status updated successfully',
      data: { id: user.id, isActive: user.isActive }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
