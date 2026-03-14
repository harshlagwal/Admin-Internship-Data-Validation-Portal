const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seed() {
  const email = 'admin@harsh.com';
  const password = 'Password@123'; // Standard secure-ish password for setup
  const fullName = 'Harsh Admin';

  try {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      console.log(`Admin ${email} already exists.`);
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        full_name: fullName,
        password_hash,
        role: 'admin',
        is_active: true
      }
    });

    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('---');
    console.log('You can now login with these credentials.');

  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
