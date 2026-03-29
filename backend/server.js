const app = require('./app');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const { networkInterfaces } = require('os');
dotenv.config();

function getLocalIpAddress() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 5000;

// Start server - use sync only for development
if (process.env.NODE_ENV === 'development') {
  sequelize.sync().then(() => {
    console.log('Database synced (development mode)');
    startServer();
  }).catch(error => {
    console.error('Database sync failed:', error);
    process.exit(1);
  });
} else {
  // In production, assume database is already migrated
  startServer();
}

function startServer() {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Only show network info in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🌐 Access on your network: http://${getLocalIpAddress()}:${PORT}`);
    }
    
    // Production ready message
    if (process.env.NODE_ENV === 'production') {
      console.log('✅ Server is production-ready and deployed!');
    }
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
}

