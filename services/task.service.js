const { prisma } = require('../db/prisma');

async function getAllTasks(query, user) {
  const { page = 1, limit = 10, status, priority } = query;

  const where = { userId: user.id };
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

async function getTaskById(id, user) {
  return prisma.task.findFirst({ 
    where: { 
        id,
        userId: user.id,
    } });
}

async function createTask(data, user) {
  const { title, description, status, priority } = data;
  return prisma.task.create({
    data: {
    title,
    description,
    userId: user.id, 
    ...(status && { status: status.toUpperCase() }),
    ...(priority && { priority: priority.toUpperCase() }),
    },
  });
}

async function updateTask(id, data, user) {
  const task = await getTaskById(id, user);
  if (!task) {
    throw { code: 'P2025' }; // Prisma not found error code
  }
  return prisma.task.update({
    where: { 
        id,
    },
    data,
  });
}

async function deleteTask(id, user) {
  const task = await getTaskById(id, user);
  if (!task) {
    throw { code: 'P2025' }; // Prisma not found error code
  }
  return prisma.task.delete({ where: { 
    id,
 } });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
