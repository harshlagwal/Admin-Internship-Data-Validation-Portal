const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { writeAuditLog } = require('../middlewares/audit');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'Email and password required.' } });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.is_active) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
  }

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
  }

  // Update last_login_at
  await prisma.admin.update({ where: { id: admin.id }, data: { last_login_at: new Date() } });

  const token = jwt.sign({ adminId: admin.id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '28800'),
  });

  // Audit
  req.admin = admin;
  await writeAuditLog(req, 'LOGIN', null, 'Admin logged in');

  return res.json({
    success: true,
    token,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '28800'),
    admin: { id: admin.id, email: admin.email, fullName: admin.full_name, role: admin.role },
  });
};

const logout = async (req, res) => {
  await writeAuditLog(req, 'LOGOUT', null, 'Admin logged out');
  return res.json({ success: true, message: 'Logged out.' });
};

const me = async (req, res) => {
  const { id, email, full_name, role, created_at, last_login_at } = req.admin;
  return res.json({ success: true, data: { id, email, fullName: full_name, role, createdAt: created_at, lastLoginAt: last_login_at } });
};

const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION', message: 'Full name, email and password are required.' } 
    });
  }

  try {
    // Check if exists
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        error: { code: 'CONFLICT', message: 'An account with this email already exists.' } 
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        full_name: fullName,
        password_hash,
        role: 'admin', // Default role
        is_active: true
      }
    });

    // Write audit log
    // Since this is a signup, there is no req.admin yet, we'll manually specify details
    await prisma.auditLog.create({
      data: {
        admin_id: newAdmin.id,
        admin_name: newAdmin.full_name,
        admin_email: newAdmin.email,
        action_type: 'SIGNUP',
        details: `New admin account created: ${newAdmin.email}`,
        ip_address: req.ip
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      adminId: newAdmin.id
    });
  } catch (error) {
    console.error('[SIGNUP ERROR]', error);
    return res.status(500).json({ 
      success: false, 
      error: { code: 'INTERNAL_ERROR', message: error.message } 
    });
  }
};

module.exports = { login, logout, me, signup };
