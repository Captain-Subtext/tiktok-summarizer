import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  try {
    // Delete in correct order to respect foreign key constraints
    console.log('Cleaning up test data...');
    
    // Delete analysis records first
    await prisma.testAnalysis.deleteMany({});
    console.log('✓ Deleted all test analysis records');
    
    // Delete videos next
    await prisma.testVideo.deleteMany({});
    console.log('✓ Deleted all test video records');
    
    // Delete authors last
    await prisma.testAuthor.deleteMany({});
    console.log('✓ Deleted all test author records');
    
    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup(); 