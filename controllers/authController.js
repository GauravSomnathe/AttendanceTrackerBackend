const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name,email,password,role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name,email,password:hashed,role });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn:'7d' });
  res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
};

exports.login = async (req,res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn:'7d' });
  res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
};
