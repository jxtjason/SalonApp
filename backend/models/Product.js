const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Product; 