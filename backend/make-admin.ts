import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  // Replace with your Google email
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npx ts-node make-admin.ts your-email@gmail.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      console.log('Make sure you have logged in at least once with Google OAuth');
      process.exit(1);
    }

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: UserRole.ADMIN,
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });

    console.log('✅ Successfully promoted user to ADMIN!');
    console.log('User details:');
    console.log(`  Name: ${updatedUser.name}`);
    console.log(`  Email: ${updatedUser.email}`);
    console.log(`  Role: ${updatedUser.role}`);
    console.log(`  Status: ${updatedUser.approvalStatus}`);
    console.log('\n🎉 You can now login and access all admin features!');
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
