const express = require('express');
const taskRoutes = require('./routes/task.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
