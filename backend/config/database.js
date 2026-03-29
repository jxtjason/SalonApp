const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support both individual DB credentials and DATABASE_URL (Render format)
let sequelize;

if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL from Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // Development: Use individual credentials
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
}

module.exports = sequelize;