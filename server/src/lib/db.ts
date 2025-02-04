import { PrismaClient } from '@prisma/client';

// Create a single instance of Prisma Client
export const prisma = new PrismaClient();

// Handle cleanup on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 