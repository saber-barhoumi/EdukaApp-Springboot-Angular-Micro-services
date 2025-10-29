const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login payload:', req.body);
  let user = await User.findOne({ username });
  if (!user && username) {
    user = await User.findOne({ email: username });
  }
  console.log('User found:', user ? user.username : null);
  if (!user) {
    console.log('No user found for username/email:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  console.log('Password valid:', valid);
  if (!valid) {
    console.log('Password mismatch for user:', user.username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  // Patch: Return full response for Angular
  const userObj = user.toObject();
  delete userObj.password;
  res.json({
    authenticated: true,
    success: true,
    message: 'Login successful',
    user: userObj,
    token
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
