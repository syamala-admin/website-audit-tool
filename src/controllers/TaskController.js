const { v4: uuidv4 } = require('uuid');
const taskRepository = require('../repository/TaskRepository');

class TaskController {
  createTask(req, res) {
    const { finding, findings, reportId, url } = req.body || {};

    if (!finding && !findings) {
      return res.status(400).json({
        error: true,
        message: 'A finding (or findings) is required to create a task.',
      });
    }

    try {
      const task = {
        id: uuidv4(),
        reportId: reportId || null,
        url: url || null,
        findings: findings || [finding],
        createdAt: new Date().toISOString(),
        status: 'open',
      };

      taskRepository.save(task);

      return res.status(201).json({ taskId: task.id, task });
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: `Unable to save task: ${err.message}`,
      });
    }
  }
}

module.exports = new TaskController();
