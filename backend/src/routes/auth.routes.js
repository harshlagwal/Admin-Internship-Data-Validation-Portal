const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/logout', authenticate, auth.logout);
router.get('/me', authenticate, auth.me);

module.exports = router;
