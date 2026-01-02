const VALID_STATUS = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const VALID_PRIORITY = ['LOW', 'MEDIUM', 'HIGH'];

function validateCreateTask(req, res, next) {
  const { title } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({ message: 'Title is required (min 3 chars)' });
  }

  validateOptionalFields(req, res, next);
}

function validateUpdateTask(req, res, next) {
  const { title } = req.body;

  if (title && title.length < 3) {
    return res.status(400).json({ message: 'Title must be at least 3 chars' });
  }

  validateOptionalFields(req, res, next);
}

function validateOptionalFields(req, res, next) {
  const { status, priority } = req.body;

  if (status && !VALID_STATUS.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  if (priority && !VALID_PRIORITY.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority value' });
  }

  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};
