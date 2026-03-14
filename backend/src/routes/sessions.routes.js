const express = require('express');
const router = express.Router();
const sessions = require('../controllers/sessions.controller');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', sessions.list);
router.get('/risk-summary', sessions.getRiskSummary);
router.get('/:id', sessions.getOne);
router.get('/:id/evaluations', sessions.getEvaluations);
router.get('/:id/face-events', sessions.getFaceEvents);
router.get('/:id/object-events', sessions.getObjectEvents);
router.get('/:id/transcripts', sessions.getTranscripts);

module.exports = router;
