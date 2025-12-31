// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.createMany({
    data: [
      { title: 'Task 1', description: 'First sample task', status: 'PENDING', priority: 'HIGH' },
      { title: 'Task 2', description: 'Second sample task', status: 'IN_PROGRESS', priority: 'MEDIUM' },
      { title: 'Task 3', description: 'Third sample task', status: 'COMPLETED', priority: 'LOW' },
      { title: 'Task 4', description: 'Fourth sample task', status: 'PENDING', priority: 'LOW' },
      { title: 'Task 5', description: 'Fifth sample task', status: 'IN_PROGRESS', priority: 'HIGH' }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
