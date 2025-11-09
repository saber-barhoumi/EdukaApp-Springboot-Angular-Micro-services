const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * Validate if a user exists (no auth required - used by other microservices)
 * Returns boolean indicating if user with given ID exists
 * IMPORTANT: This must be defined BEFORE /:id route to avoid conflicts
 */
router.get('/:id/validate', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user !== null);
    } catch (error) {
        console.error('Error validating user:', error);
        res.json(false);
    }
});

router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
