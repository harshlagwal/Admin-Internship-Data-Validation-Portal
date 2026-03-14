const prisma = require('../lib/prisma');

const list = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 15);
  const skip  = (page - 1) * limit;
  const search = req.query.search?.trim();

  const where = search
    ? { OR: [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email:     { contains: search, mode: 'insensitive' } },
        { username:  { contains: search, mode: 'insensitive' } },
      ] }
    : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' } }),
    prisma.user.count({ where }),
  ]);

  // Strip password_hash from output
  const safe = data.map(({ password_hash, ...u }) => u);

  return res.json({ success: true, data: safe, meta: { page, limit, total } });
};

const getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, error: { message: 'Invalid ID.' } });

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ success: false, error: { message: 'Candidate not found.' } });

  const { password_hash, ...safe } = user;
  return res.json({ success: true, data: safe });
};

const updateStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ success: false, error: { message: 'Invalid status.' } });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status }
  });

  // Audit Log
  const { writeAuditLog } = require('../middlewares/audit');
  await writeAuditLog(req, 'UPDATE_STATUS', id.toString(), `Changed status for candidate ${user.full_name} to ${status}`);

  return res.json({ success: true, data: user });
};

const updateDetail = async (req, res) => {
  const id = parseInt(req.params.id);
  const { fullName, email, department } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      full_name: fullName,
      email,
      department
    }
  });

  const { writeAuditLog } = require('../middlewares/audit');
  await writeAuditLog(req, 'UPDATE_CANDIDATE', id.toString(), `Updated details for candidate ${user.full_name}`);

  return res.json({ success: true, data: user });
};

module.exports = { list, getOne, updateStatus, updateDetail };
