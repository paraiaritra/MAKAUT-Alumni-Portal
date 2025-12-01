// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // use modern express json parser
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // logs requests (method url status time)

// Optional: temporary request body logger for debugging POSTs
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`--> ${req.method} ${req.originalUrl} BODY:`, req.body);
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/alumni', require('./routes/alumni'));

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'MAKAUT Alumni Portal API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      jobs: '/api/jobs',
      alumni: '/api/alumni'
    }
  });
});
// health-check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error ->', err.stack || err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
});
