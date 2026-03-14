const prisma = require('../lib/prisma');
const { writeAuditLog } = require('../middlewares/audit');

const list = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, parseInt(req.query.limit) || 20);
  const skip   = (page - 1) * limit;
  const status = req.query.status;
  const userId = req.query.userId ? parseInt(req.query.userId) : null;

  const where = {};
  if (status) where.status = status;
  if (userId) where.user_id = userId;

  const [data, total] = await Promise.all([
    prisma.interviewSession.findMany({
      where,
      skip,
      take: limit,
      orderBy: { start_time: 'desc' },
      include: {
        user: { select: { id: true, full_name: true, email: true } }
      }
    }),
    prisma.interviewSession.count({ where }),
  ]);

  return res.json({ success: true, data, meta: { page, limit, total } });
};

const getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, error: { message: 'Invalid ID.' } });

  const session = await prisma.interviewSession.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, full_name: true, email: true } }
    }
  });

  if (!session) return res.status(404).json({ success: false, error: { message: 'Session not found.' } });
  
  await writeAuditLog(req, 'VIEW_SESSION', id, `Viewed session detail for candidate ${session.user.full_name}`);
  
  return res.json({ success: true, data: session });
};

const getEvaluations = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const data = await prisma.answerEvaluation.findMany({ where: { session_id: sessionId } });
  return res.json({ success: true, data });
};

const getFaceEvents = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const data = await prisma.facePoseEvent.findMany({ where: { session_id: sessionId } });
  return res.json({ success: true, data });
};

const getObjectEvents = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const data = await prisma.objectDetectionEvent.findMany({ where: { session_id: sessionId } });
  return res.json({ success: true, data });
};

const getTranscripts = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const data = await prisma.audioTranscript.findMany({ where: { session_id: sessionId } });
  return res.json({ success: true, data });
};

/**
 * Custom query for the risk summary view
 */
const getRiskSummary = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, parseInt(req.query.limit) || 10);
  const skip   = (page - 1) * limit;

  // We'll perform the aggregation in JS for simplicity and to avoid View dependency
  // In a real production environment with 1M+ rows, we'd use a View or complex queryRaw
  const sessions = await prisma.interviewSession.findMany({
    skip,
    take: limit,
    orderBy: { start_time: 'desc' },
    include: {
      user: { select: { full_name: true, email: true, status: true } },
      _count: {
        select: {
          face_events: true, // simplified: showing all events, not just >3 severity for now
          object_events: true
        }
      }
    }
  });

  const total = await prisma.interviewSession.count();

  const data = sessions.map(s => ({
    session_id: s.id,
    full_name: s.user.full_name,
    email: s.user.email,
    start_time: s.start_time,
    total_risk_score: s.total_risk_score,
    phone_detection_count: s._count.object_events,
    suspicious_face_movements: s._count.face_events,
    status: s.user.status || 'PENDING'
  }));

  return res.json({ success: true, data, meta: { total, page, limit } });
};

module.exports = { 
  list, 
  getOne, 
  getEvaluations, 
  getFaceEvents, 
  getObjectEvents, 
  getTranscripts,
  getRiskSummary 
};
