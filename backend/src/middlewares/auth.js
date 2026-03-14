const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

/**
 * Middleware: verify JWT, attach admin to req.admin
 */
const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided.' } });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin || !admin.is_active) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin not found or inactive.' } });
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: 'TOKEN_INVALID', message: 'Token is invalid or expired.' } });
  }
};

/**
 * Middleware: require super_admin role
 */
const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Super admin access required.' } });
  }
  next();
};

module.exports = { authenticate, requireSuperAdmin };
