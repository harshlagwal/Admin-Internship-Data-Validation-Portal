const prisma = require('../lib/prisma');

/**
 * Write an audit log entry — fire-and-forget, never throws.
 */
const writeAuditLog = async (req, actionType, targetId = null, details = null) => {
  try {
    if (!req.admin) return;
    await prisma.auditLog.create({
      data: {
        admin_id:    req.admin.id,
        admin_name:  req.admin.full_name,
        admin_email: req.admin.email,
        action_type: actionType,
        target_id:   targetId ? String(targetId) : null,
        ip_address:  req.ip || req.socket?.remoteAddress || null,
        details,
      },
    });
  } catch (err) {
    console.error('[AUDIT] Failed to write log:', err.message);
  }
};

module.exports = { writeAuditLog };
