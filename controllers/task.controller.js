const taskService = require('../services/task.service');

async function getTasks(req, res, next) {
  try {
    const result = await taskService.getAllTasks(req.query, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body, req.user);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};