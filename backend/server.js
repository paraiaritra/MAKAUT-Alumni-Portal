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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes')); // NEW

// Root
app.get('/', (req, res) => {
  res.json({ message: 'MAKAUT Alumni Portal API v1.0.0' });
});

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error ->', err.stack || err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));