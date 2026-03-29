const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Generate new token
    const newToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      success: true, 
      data: { token: newToken }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Logout endpoint
exports.logout = async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, just return success
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};
