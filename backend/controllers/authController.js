const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      success: true, 
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

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

