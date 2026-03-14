require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const candidateRoutes = require('./routes/candidates.routes');
const sessionRoutes = require('./routes/sessions.routes');
const auditRoutes = require('./routes/audit.routes');
const reportRoutes = require('./routes/reports.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Slow down, admin.' } }
});
app.use('/api/', limiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Admin Portal Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});
