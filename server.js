const path = require('path');
const express = require('express');
const auditRoutes = require('./src/routes/auditRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/audit', auditRoutes);
app.use('/tasks', taskRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'An unexpected server error occurred.',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Website audit tool listening on port ${PORT}`);
  });
}

module.exports = app;
