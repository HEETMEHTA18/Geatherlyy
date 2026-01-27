import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🔄 Resetting database and creating fresh accounts...\n');

  try {
    // Delete all data in correct order (respecting foreign keys)
    console.log('🗑️  Deleting all existing data...');
    
    await prisma.quizAttempt.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.clubCoordinator.deleteMany();
    await prisma.clubMemberRemovalRequest.deleteMany();
    await prisma.clubMember.deleteMany();
    await prisma.club.deleteMany();
    await prisma.approvalRequest.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('✅ All existing data deleted\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('pass', 10);

    // Create Mentor account
    const mentor = await prisma.user.create({
      data: {
        email: 'mentor@university.edu',
        password: hashedPassword,
        name: 'Dr. Sarah Johnson',
        universityId: 'MENTOR001',
        department: 'Computer Science',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
        role: 'FACULTY',
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });
    console.log('✅ Created MENTOR account:');
    console.log('   Email: mentor@university.edu');
    console.log('   Password: pass');
    console.log('   Role: FACULTY (Mentor)\n');

    // Create Member account
    const member = await prisma.user.create({
      data: {
        email: 'member@university.edu',
        password: hashedPassword,
        name: 'John Doe',
        universityId: 'MEMBER001',
        department: 'Information Technology',
        year: '2nd Year',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff',
        role: 'MEMBER',
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });
    console.log('✅ Created MEMBER account:');
    console.log('   Email: member@university.edu');
    console.log('   Password: pass');
    console.log('   Role: MEMBER\n');

    // Create Coordinator account
    const coordinator = await prisma.user.create({
      data: {
        email: 'coordinator@university.edu',
        password: hashedPassword,
        name: 'Emily Rodriguez',
        universityId: 'COORD001',
        department: 'Electronics & Communication',
        year: '3rd Year',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=f59e0b&color=fff',
        role: 'COORDINATOR',
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });
    console.log('✅ Created COORDINATOR account:');
    console.log('   Email: coordinator@university.edu');
    console.log('   Password: pass');
    console.log('   Role: COORDINATOR\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database reset complete! Fresh accounts created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Login Credentials:\n');
    console.log('1️⃣  MENTOR ACCOUNT:');
    console.log('   Email: mentor@university.edu');
    console.log('   Password: pass\n');
    console.log('2️⃣  MEMBER ACCOUNT:');
    console.log('   Email: member@university.edu');
    console.log('   Password: pass\n');
    console.log('3️⃣  COORDINATOR ACCOUNT:');
    console.log('   Email: coordinator@university.edu');
    console.log('   Password: pass\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
