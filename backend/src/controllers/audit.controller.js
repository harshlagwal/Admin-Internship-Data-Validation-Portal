const prisma = require('../lib/prisma');

const list = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;
  const actionType = req.query.action;

  const where = actionType ? { action_type: actionType } : {};

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        admin: { select: { full_name: true, email: true } }
      }
    }),
    prisma.auditLog.count({ where }),
  ]);

  // Clean data for frontend
  const cleaned = data.map(log => ({
    ...log,
    id: log.id.toString() // BigInt to String
  }));

  return res.json({ success: true, data: cleaned, meta: { page, limit, total } });
};

module.exports = { list };
