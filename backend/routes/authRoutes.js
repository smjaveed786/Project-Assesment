const express = require('express');
const { registerUser, loginUser, getUsers, updateUserRole } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const { check } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validate
], registerUser);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validate
], loginUser);

router.get('/users', protect, getUsers);
router.put('/role/:id', protect, admin, updateUserRole);

module.exports = router;
