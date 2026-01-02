// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create users
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'USER'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'ADMIN'
    }
  });

  // Create tasks for user1
  await prisma.task.createMany({
    data: [
      { 
        title: 'Task 1', 
        description: 'First task', 
        status: 'PENDING', 
        priority: 'HIGH',
        userId: user1.id
      },
      { 
        title: 'Task 2', 
        description: 'Second task', 
        status: 'IN_PROGRESS', 
        priority: 'MEDIUM',
        userId: user1.id
      },
      { 
        title: 'Task 3', 
        description: 'Third task', 
        status: 'COMPLETED', 
        priority: 'LOW',
        userId: user1.id
      },
    ]
  });

  // Create tasks for user2
  await prisma.task.createMany({
    data: [
      { 
        title: 'Admin Task 1', 
        description: 'First admin task', 
        status: 'PENDING', 
        priority: 'HIGH',
        userId: user2.id
      },
      { 
        title: 'Admin Task 2', 
        description: 'Second admin task', 
        status: 'IN_PROGRESS', 
        priority: 'MEDIUM',
        userId: user2.id
      },
    ]
  });

  console.log('Seed data created successfully');
  console.log('Test users:');
  console.log('  john@example.com / Password123!');
  console.log('  jane@example.com / Password123!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });