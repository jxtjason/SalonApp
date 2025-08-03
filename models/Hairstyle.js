const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hairstyle = sequelize.define('Hairstyle', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'general' }, // e.g., 'bridal', 'casual', 'formal'
  difficulty: { type: DataTypes.ENUM('easy', 'medium', 'hard'), defaultValue: 'medium' },
  estimatedTime: { type: DataTypes.INTEGER }, // in minutes
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Hairstyle;
