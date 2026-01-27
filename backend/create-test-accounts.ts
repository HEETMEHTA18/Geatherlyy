import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestAccounts() {
  console.log('🚀 Creating test accounts...\n');

  try {
    // Hash password for all accounts
    const hashedPassword = await bcrypt.hash('pass', 10);

    // Create or update Faculty account
    const faculty = await prisma.user.upsert({
      where: { email: 'faculty@university.edu' },
      update: {
        password: hashedPassword,
      },
      create: {
        email: 'faculty@university.edu',
        password: hashedPassword,
        name: 'Dr. Sarah Johnson',
        universityId: 'FAC001',
        department: 'Computer Science',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
        role: 'FACULTY',
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });

    console.log('✅ Faculty account created:');
    console.log('   Email: faculty@university.edu');
    console.log('   Password: pass');
    console.log('   Name: Dr. Sarah Johnson');
    console.log('   Role: FACULTY');
    console.log('   Status: APPROVED\n');

    // Create or update Regular User account
    const user = await prisma.user.upsert({
      where: { email: 'user@university.edu' },
      update: {
        password: hashedPassword,
      },
      create: {
        email: 'user@university.edu',
        password: hashedPassword,
        name: 'John Doe',
        universityId: 'STU001',
        department: 'Information Technology',
        year: '2nd Year',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff',
        role: 'MEMBER',
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });

    console.log('✅ Regular user account created:');
    console.log('   Email: user@university.edu');
    console.log('   Password: pass');
    console.log('   Name: John Doe');
    console.log('   Role: MEMBER');
    console.log('   Status: APPROVED\n');

    // Create or update Coordinator account
    const coordinator = await prisma.user.upsert({
      where: { email: 'coordinator@university.edu' },
      update: {
        password: hashedPassword,
      },
      create: {
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

    console.log('✅ Coordinator account created:');
    console.log('   Email: coordinator@university.edu');
    console.log('   Password: pass');
    console.log('   Name: Emily Rodriguez');
    console.log('   Role: COORDINATOR');
    console.log('   Status: APPROVED\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Test accounts created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Login Information:\n');
    console.log('1️⃣  FACULTY ACCOUNT:');
    console.log('   Email: faculty@university.edu');
    console.log('   Password: pass\n');
    console.log('2️⃣  REGULAR USER ACCOUNT:');
    console.log('   Email: user@university.edu');
    console.log('   Password: pass\n');
    console.log('3️⃣  COORDINATOR ACCOUNT:');
    console.log('   Email: coordinator@university.edu');
    console.log('   Password: pass\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestAccounts()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
