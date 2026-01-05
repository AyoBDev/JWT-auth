const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);

module.exports = router;