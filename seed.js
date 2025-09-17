// run with: node seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  const pass = await bcrypt.hash('password123', 10);
  await User.deleteMany({});
  await User.create({ name: 'Admin', email: 'admin@example.com', password: pass, role: 'admin' });
  await User.create({ name: 'Alice', email: 'alice@example.com', password: pass, role: 'employee' });
  await User.create({ name: 'Bob', email: 'bob@example.com', password: pass, role: 'employee' });
  console.log('seeded');
  process.exit();
}
seed();
