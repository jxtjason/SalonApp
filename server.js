const app = require('./app');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

// Sync DB and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});



