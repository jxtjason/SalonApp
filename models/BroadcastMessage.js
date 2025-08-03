const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BroadcastMessage = sequelize.define('BroadcastMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  targetAudience: { type: DataTypes.ENUM('clients', 'apprentices', 'all'), defaultValue: 'all' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
  expiresAt: { type: DataTypes.DATE }, // optional expiration date
  createdBy: { type: DataTypes.INTEGER, allowNull: false } // admin user ID
});

module.exports = BroadcastMessage;
