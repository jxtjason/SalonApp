const sequelize = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true });

  const password = await bcrypt.hash('password', 10);

  await User.bulkCreate([
    { name: 'Admin', email: 'admin@example.com', password, role: 'admin' },
    { name: 'Apprentice1', email: 'apprentice1@example.com', password, role: 'apprentice' },
    { name: 'Client1', email: 'client1@example.com', password, role: 'client' }
  ]);

  await Product.bulkCreate([
    { name: 'Shampoo', description: 'Hair shampoo', price: 10, stock: 100 },
    { name: 'Conditioner', description: 'Hair conditioner', price: 12, stock: 80 }
  ]);

  console.log('Seed data inserted');
  process.exit();
}

seed(); 