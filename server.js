const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Create pg pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client
const prisma = new PrismaClient({
  adapter,
});

const app = express();

app.use(express.json());

function logRequest(req, res, next) {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
}

app.use(logRequest);

function validateCreate(req, res, next) {
    const { title } = req.body;
    if (!title || title.length < 3) {
        return res.status(400).json({ message: 'Title is required (min 3 chars)' });
    }
    validateOptionalFields(req, res, next);
}

function validateUpdate(req, res, next) {
    const { title } = req.body;
    if (title && title.length < 3) { // Only validate if title is provided
        return res.status(400).json({ message: 'Title must be at least 3 chars' });
    }
    validateOptionalFields(req, res, next);
}

function validateOptionalFields(req, res, next) {
    const { status, priority } = req.body;
    if (status && !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }
    if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
    }
    next();
}

async function getAllTasks(req, res) {
    try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const where = {};
    if (status) where.status = status.toUpperCase().replace('-', '_');
    if (priority) where.priority = priority.toUpperCase();
    
    const tasks = await prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await prisma.task.count({ where });
    
    res.json({
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
}

async function getTaskById(req, res) {
     try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
          where: { id },
        });
        if (task) {
          res.status(200).json(task);
        } else {
          res.status(404).json({ message: 'Task not found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
}

async function createTask(req, res) {
     try {
        const { title, description, status, priority } = req.body;
        const task = await prisma.task.create({
          data: {
            title,
            description,
            ...(status && { status: status.toUpperCase() }),
            ...(priority && { priority: priority.toUpperCase() }),
          },
        });
        res.status(201).json(task);
        
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
    
}

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;
        
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        
        const updatedTask = await prisma.task.update({
            where: { id },
            data: updateData,
        });
        
        res.status(200).json(updatedTask);
        
    } catch (error) {
        if (error.code === 'P2025') {  // Prisma "Record not found" error
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Database error', error: error.message });
    }
}

async function deleteTask(req, res) {
     try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Database error', error: error.message });
    }
}


app.get('/api/tasks', async (req, res) => {
    await getAllTasks(req, res);
});

app.get('/api/tasks/:id', async (req, res) => {
   await getTaskById(req, res);
});

app.put('/api/tasks/:id', validateUpdate, async (req, res) => {
    await updateTask(req, res);
});

app.delete('/api/tasks/:id', async (req, res) => {
   await deleteTask(req, res);
});

app.post('/api/tasks', validateCreate, async (req, res) => {
   await createTask(req, res);
    
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  await pool.end(); // If using pg adapter
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await prisma.$disconnect();
  await pool.end(); // If using pg adapter
  process.exit(0);
});