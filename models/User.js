const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  
  // 🚨 Add this for late tracking
  lateCount: { type: Number, default: 0 }
}, 
{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
