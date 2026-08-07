'use strict';

const express = require('express');
const path = require('path');
const auditRoutes = require('./routes/auditRoutes');
const taskRoutes = require('./routes/taskRoutes');

function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/api', auditRoutes);
  app.use('/', taskRoutes);

  // Centralized error handler: no silent failures.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  });

  return app;
}

module.exports = createApp;
