const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const controller = require('../controllers/task.controller');
const {
  validateCreateTask,
  validateUpdateTask,
} = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', controller.getTasks);
router.get('/:id', controller.getTask);
router.post('/', validateCreateTask, controller.createTask);
router.put('/:id', validateUpdateTask, controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
