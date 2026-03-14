const express = require('express');
const router = express.Router();
const audit = require('../controllers/audit.controller');
const { authenticate, requireSuperAdmin } = require('../middlewares/auth');

// Audit logs are sensitive, usually restricted to super_admin
router.get('/', authenticate, requireSuperAdmin, audit.list);

module.exports = router;
