import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updatePasswords() {
  console.log('🔑 Updating passwords for test accounts...\n');

  try {
    const hashedPassword = await bcrypt.hash('pass', 10);

    // Update admin password
    await prisma.user.update({
      where: { email: 'admin@gatherly.com' },
      data: { password: hashedPassword },
    });
    console.log('✅ Updated admin@gatherly.com password to: pass');

    // Update seed member passwords
    const members = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'member',
        },
      },
    });

    for (const member of members) {
      await prisma.user.update({
        where: { id: member.id },
        data: { password: hashedPassword },
      });
    }
    console.log(`✅ Updated ${members.length} member account passwords to: pass`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Passwords updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 You can now login with:\n');
    console.log('ADMIN:');
    console.log('  Email: admin@gatherly.com');
    console.log('  Password: pass\n');
    console.log('MEMBERS:');
    console.log('  Email: member1@university.edu through member15@university.edu');
    console.log('  Password: pass\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updatePasswords()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
