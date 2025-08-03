const User = require('./User');
const Appointment = require('./Appointment');
const Product = require('./Product');
const Review = require('./Review');
const Vote = require('./Vote');
const Order = require('./Order');
const Hairstyle = require('./Hairstyle');
const BroadcastMessage = require('./BroadcastMessage');

// Define associations
// User associationscd
User.hasMany(Appointment, { foreignKey: 'clientId', as: 'clientAppointments' });
User.hasMany(Appointment, { foreignKey: 'apprenticeId', as: 'apprenticeAppointments' });
User.hasMany(Review, { foreignKey: 'clientId', as: 'clientReviews' });
User.hasMany(Review, { foreignKey: 'apprenticeId', as: 'apprenticeReviews' });
User.hasMany(Vote, { foreignKey: 'clientId', as: 'clientVotes' });
User.hasMany(Vote, { foreignKey: 'apprenticeId', as: 'apprenticeVotes' });
User.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });

// Appointment associations
Appointment.belongsTo(User, { foreignKey: 'clientId', as: 'clientForAppointment' });
Appointment.belongsTo(User, { foreignKey: 'apprenticeId', as: 'apprenticeForAppointment' });

// Review associations
Review.belongsTo(User, { foreignKey: 'clientId', as: 'clientForReview' });
Review.belongsTo(User, { foreignKey: 'apprenticeId', as: 'apprenticeForReview' });

// Vote associations
Vote.belongsTo(User, { foreignKey: 'clientId', as: 'clientForVote' });
Vote.belongsTo(User, { foreignKey: 'apprenticeId', as: 'apprenticeForVote' });

// Order associations
Order.belongsTo(User, { foreignKey: 'clientId', as: 'clientForOrder' });
Order.belongsTo(Product, { foreignKey: 'productId' });


// Product associations
Product.hasMany(Order, { foreignKey: 'productId' });

// BroadcastMessage associations
BroadcastMessage.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(BroadcastMessage, { foreignKey: 'createdBy', as: 'broadcastMessages' });

module.exports = {
  User,
  Appointment,
  Product,
  Review,
  Vote,
  Order,
  Hairstyle,
  BroadcastMessage
};
