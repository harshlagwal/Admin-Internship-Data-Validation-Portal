const express = require('express');
const router = express.Router();
const candidates = require('../controllers/candidates.controller');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', candidates.list);
router.get('/:id', candidates.getOne);
router.patch('/:id/status', candidates.updateStatus);
router.patch('/:id', candidates.updateDetail);

module.exports = router;
