const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const missionsRoutes = require('./routes/missions.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global Rate Limiting
app.use('/api', (req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
}, globalLimiter);

app.get('/debug', (req, res) => {
  res.status(200).json({ status: 'DEBUG_ACTIVE', pid: process.pid });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

// Static files (from root directory where index.html is)
app.use(express.static(path.join(__dirname, '..')));

// Health Check with Diagnostics
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
    diagnostics: {
      supabase_url_set: !!process.env.SUPABASE_URL,
      supabase_key_set: !!process.env.SUPABASE_ANON_KEY,
      allowed_origins: process.env.ALLOWED_ORIGINS || '*'
    }
  });
});

// Config Endpoint for Frontend
app.get('/api/config', (req, res) => {
    res.status(200).json({
      supabase_url: process.env.SUPABASE_URL,
      supabase_anon_key: process.env.SUPABASE_ANON_KEY
    });
});

// Catch-all for SPA: serve index.html for any non-API route
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
