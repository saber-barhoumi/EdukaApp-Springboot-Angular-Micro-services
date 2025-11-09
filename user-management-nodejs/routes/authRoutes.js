const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

// Debug route: List all users
router.get('/debug-users', async (req, res) => {
	const User = require('../models/User');
	const users = await User.find({}, { username: 1, email: 1, role: 1 });
	res.json(users);
});

// Debug route: Reset password for a user
router.post('/debug-reset-password', async (req, res) => {
	const User = require('../models/User');
	const bcrypt = require('bcryptjs');
	const { username, newPassword } = req.body;
	const user = await User.findOne({ username });
	if (!user) return res.status(404).json({ error: 'User not found' });
	user.password = await bcrypt.hash(newPassword, 10);
	await user.save();
	res.json({ message: 'Password reset successful' });
});

module.exports = router;
