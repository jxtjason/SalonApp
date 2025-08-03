const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  service: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

Appointment.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Appointment.belongsTo(User, { as: 'apprentice', foreignKey: 'apprenticeId' });

module.exports = Appointment; 