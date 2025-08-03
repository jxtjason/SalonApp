const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/apprentices', require('./routes/apprentices'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/hairstyles', require('./routes/hairstyles'));
app.use('/api/broadcast-messages', require('./routes/broadcastMessages'));

// Health check
app.get('/', (req, res) => res.send('Salon Booking API Running'));

module.exports = app;
