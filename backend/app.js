const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

// Configure CORS with development settings
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      /^http:\/\/localhost(:[0-9]+)?$/,  // Localhost with any port
      /^http:\/\/192\.168\..*$/,        // Any 192.168.x.x address
      /^http:\/\/172\.20\..*$/,         // Your specific 172.20.x.x network
      /^exp:\/\/.*$/,                    // Any Expo app
      /^http:\/\/.*\.exp\.direct(:[0-9]+)?$/,  // Expo web
    ];

    // Allow if the origin matches any of the patterns
    if (allowedOrigins.some(regex => regex.test(origin))) {
      return callback(null, true);
    }

    // In production, allow all origins for mobile apps
    // You can restrict this to specific domains if needed
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }

    // For development, allow all origins
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/users', require('./routes/userProfile'));
app.use('/api/apprentices', require('./routes/apprentices'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/hairstyles', require('./routes/hairstyles'));
app.use('/api/broadcast-messages', require('./routes/broadcastMessages'));

// Error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Salon Booking API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
