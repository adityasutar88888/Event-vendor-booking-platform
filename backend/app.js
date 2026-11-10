const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const createApp = () => {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const allowedOrigins = [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    })
  );
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ name: 'EventEase API', status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/vendors', vendorRoutes);
  app.use('/api/bookings', bookingRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  });

  return app;
};

module.exports = createApp;
