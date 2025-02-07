import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateLastActivity() {
  await prisma.testVideo.updateMany({
    data: {
      lastActivity: new Date(),
    }
  })
}

updateLastActivity()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 