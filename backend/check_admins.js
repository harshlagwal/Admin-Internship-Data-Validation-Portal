const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        full_name: true,
        created_at: true
      }
    });

    console.log('--- Current Registered Admins ---');
    if (admins.length === 0) {
      console.log('No admins found in the database. The table is empty.');
    } else {
      admins.forEach(admin => {
        console.log(`ID: ${admin.id} | Email: ${admin.email} | Name: ${admin.full_name}`);
      });
    }
    console.log('--------------------------------');

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
