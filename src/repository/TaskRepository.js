/**
 * In-memory repository for tasks saved from audit reports. Currently
 * in-memory for the MVP; extensible to a persistent store later.
 */
class TaskRepository {
  constructor() {
    this.tasks = new Map();
  }

  save(task) {
    this.tasks.set(task.id, task);
    return task;
  }

  findById(id) {
    return this.tasks.get(id) || null;
  }

  findAll() {
    return Array.from(this.tasks.values());
  }
}

module.exports = new TaskRepository();
