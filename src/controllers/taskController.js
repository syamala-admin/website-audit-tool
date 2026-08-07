'use strict';

const TaskFactory = require('../services/taskFactory');

const taskFactory = new TaskFactory();

async function createTask(req, res) {
  const { finding } = req.body || {};

  if (!finding || typeof finding !== 'object') {
    return res.status(400).json({ error: 'A "finding" object is required to create a task.' });
  }

  try {
    const task = taskFactory.createFromFinding(finding);
    // Stub: in the future this will call out to a real project-management integration.
    return res.status(201).json({ task });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to create task.' });
  }
}

module.exports = { createTask };
