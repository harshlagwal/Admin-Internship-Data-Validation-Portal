const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@portal.gov';
  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log('Seed: Admin already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  await prisma.admin.create({
    data: {
      email: adminEmail,
      full_name: 'System Administrator',
      password_hash: passwordHash,
      role: 'super_admin'
    }
  });

  console.log('Seed: Created default super_admin');
  console.log('Email: admin@portal.gov');
  console.log('Password: Admin@123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
