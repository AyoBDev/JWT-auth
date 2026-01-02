const { prisma } = require('../db/prisma');

async function getAllTasks(query) {
  const { page = 1, limit = 10, status, priority } = query;

  const where = { userId: req.user.id };
  if (status) where.status = status.toUpperCase().replace('-', '_');
  if (priority) where.priority = priority.toUpperCase();

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getTaskById(id) {
  return prisma.task.findUnique({ 
    where: { 
        id,
        userId: req.user.id,
    } });
}

async function createTask(data) {
  return prisma.task.create({
    data: {
    title,
    description,
    userId: req.user.id,  // ← Add this
    ...(status && { status: status.toUpperCase() }),
    ...(priority && { priority: priority.toUpperCase() }),
    },
  });
}

async function updateTask(id, data) {
  return prisma.task.update({
    where: { 
        id,
        userId: req.user.id,
    },
    data,
  });
}

async function deleteTask(id) {
  return prisma.task.delete({ where: { 
    id,
    userId: req.user.id
 } });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
