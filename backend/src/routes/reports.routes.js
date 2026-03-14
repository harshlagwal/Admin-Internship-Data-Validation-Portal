const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports.controller');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/session/:id/pdf', reports.downloadPdf);
router.get('/session/:id/xlsx', reports.downloadExcel);

module.exports = router;
