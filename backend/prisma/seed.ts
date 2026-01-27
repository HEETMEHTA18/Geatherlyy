import { PrismaClient, UserRole, ActivityType, ActivityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==================== STEP 1: Create ONLY ONE Admin (Developer Setup) ====================
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gatherly.com' },
    update: {},
    create: {
      email: 'admin@gatherly.com',
      name: 'System Admin',
      universityId: 'ADMIN001',
      department: 'Administration',
      role: UserRole.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=6366f1&color=fff',
      approvalStatus: 'APPROVED',
      profileComplete: true,
    },
  });
  console.log('✅ Created system admin (developer setup)');

  // ==================== STEP 2: Create Regular Member Users ====================
  const members = [];
  for (let i = 1; i <= 15; i++) {
    const member = await prisma.user.upsert({
      where: { email: `member${i}@university.edu` },
      update: {},
      create: {
        email: `member${i}@university.edu`,
        name: `Student ${i}`,
        universityId: `STU${String(i).padStart(4, '0')}`,
        department: i % 3 === 0 ? 'Computer Science' : i % 3 === 1 ? 'Electronics' : 'Mechanical',
        year: String((i % 4) + 1),
        role: UserRole.MEMBER,
        avatar: `https://ui-avatars.com/api/?name=Student+${i}&background=3b82f6&color=fff`,
        approvalStatus: 'APPROVED',
        profileComplete: true,
      },
    });
    members.push(member);
  }
  console.log('✅ Created 15 member users');

  // ==================== STEP 3: Create Users Requesting Faculty Role (Pending Approval) ====================
  const pendingFaculty1 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@university.edu' },
    update: {},
    create: {
      email: 'sarah.johnson@university.edu',
      name: 'Dr. Sarah Johnson',
      universityId: 'FAC001',
      department: 'Computer Science',
      role: UserRole.MEMBER, // Still MEMBER until approved
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=8b5cf6&color=fff',
      approvalStatus: 'PENDING', // Waiting for admin approval
      profileComplete: true,
    },
  });

  const pendingFaculty2 = await prisma.user.upsert({
    where: { email: 'michael.chen@university.edu' },
    update: {},
    create: {
      email: 'michael.chen@university.edu',
      name: 'Prof. Michael Chen',
      universityId: 'FAC002',
      department: 'Fine Arts',
      role: UserRole.MEMBER, // Still MEMBER until approved
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff',
      approvalStatus: 'PENDING', // Waiting for admin approval
      profileComplete: true,
    },
  });
  console.log('✅ Created 2 users requesting Faculty role (pending approval)');

  // ==================== STEP 4: Create Approval Requests for Faculty ====================
  await prisma.approvalRequest.create({
    data: {
      userId: pendingFaculty1.id,
      requestedRole: UserRole.FACULTY,
      requestedFor: 'Tech Innovators Club',
      status: 'PENDING',
      reason: 'I am a Computer Science professor with 10 years of experience. I would like to mentor the Tech club.',
    },
  });

  await prisma.approvalRequest.create({
    data: {
      userId: pendingFaculty2.id,
      requestedRole: UserRole.FACULTY,
      requestedFor: 'Creative Arts Society',
      status: 'PENDING',
      reason: 'I am an Arts professor and want to guide students in creative activities.',
    },
  });
  console.log('✅ Created 2 pending faculty approval requests');

  // ==================== STEP 5: Create Users Requesting Coordinator Role ====================
  const pendingCoordinator1 = await prisma.user.upsert({
    where: { email: 'emily.rodriguez@university.edu' },
    update: {},
    create: {
      email: 'emily.rodriguez@university.edu',
      name: 'Emily Rodriguez',
      universityId: 'STU0100',
      department: 'Computer Science',
      year: '3',
      role: UserRole.MEMBER, // Still MEMBER until approved by mentor
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff',
      approvalStatus: 'PENDING',
      profileComplete: true,
    },
  });

  const pendingCoordinator2 = await prisma.user.upsert({
    where: { email: 'david.kim@university.edu' },
    update: {},
    create: {
      email: 'david.kim@university.edu',
      name: 'David Kim',
      universityId: 'STU0101',
      department: 'Electronics',
      year: '4',
      role: UserRole.MEMBER, // Still MEMBER until approved by mentor
      avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=ec4899&color=fff',
      approvalStatus: 'PENDING',
      profileComplete: true,
    },
  });
  console.log('✅ Created 2 users requesting Coordinator role (pending approval)');

  // ==================== STEP 6: Create Approval Requests for Coordinators ====================
  await prisma.approvalRequest.create({
    data: {
      userId: pendingCoordinator1.id,
      requestedRole: UserRole.COORDINATOR,
      requestedFor: 'Tech Innovators Club',
      status: 'PENDING',
      reason: 'I am passionate about technology and want to organize tech events for our club.',
    },
  });

  await prisma.approvalRequest.create({
    data: {
      userId: pendingCoordinator2.id,
      requestedRole: UserRole.COORDINATOR,
      requestedFor: 'Sports & Fitness Club',
      status: 'PENDING',
      reason: 'I have experience organizing sports events and want to coordinate club activities.',
    },
  });
  console.log('✅ Created 2 pending coordinator approval requests');

  // ==================== STEP 7: Create Sample Approved Mentor (for demonstration) ====================
  // This demonstrates what happens AFTER admin approves a faculty request
  const approvedMentor = await prisma.user.upsert({
    where: { email: 'mentor@university.edu' },
    update: {},
    create: {
      email: 'mentor@university.edu',
      name: 'Prof. Alex Martinez',
      universityId: 'FAC003',
      department: 'Physical Education',
      role: UserRole.FACULTY, // APPROVED by admin
      avatar: 'https://ui-avatars.com/api/?name=Alex+Martinez&background=10b981&color=fff',
      approvalStatus: 'APPROVED',
      profileComplete: true,
    },
  });
  console.log('✅ Created 1 approved mentor (demonstration)');

  // Create an APPROVED coordinator who can create clubs
  const approvedCoordinator = await prisma.user.upsert({
    where: { email: 'coordinator@university.edu' },
    update: {},
    create: {
      email: 'coordinator@university.edu',
      name: 'Jessica Chen',
      universityId: 'STU0200',
      department: 'Physical Education',
      year: '4',
      role: UserRole.COORDINATOR, // APPROVED by mentor
      avatar: 'https://ui-avatars.com/api/?name=Jessica+Chen&background=f59e0b&color=fff',
      approvalStatus: 'APPROVED',
      profileComplete: true,
    },
  });
  console.log('✅ Created 1 approved coordinator (demonstration)');

  // ==================== STEP 8: Coordinator Creates Clubs (Pending Mentor Approval) ====================
  // Pending club - waiting for mentor approval
  const pendingClub = await prisma.club.create({
    data: {
      name: 'Tech Innovators Club',
      description: 'A community for technology enthusiasts to learn, build, and innovate together.',
      category: 'Technology',
      imageUrl: 'https://ui-avatars.com/api/?name=Tech+Innovators&background=3b82f6&color=fff&size=128',
      createdBy: pendingCoordinator1.id, // Created by pending coordinator
      approvalStatus: 'PENDING', // Waiting for mentor approval
      isActive: false, // Not visible to users yet
    },
  });
  console.log('✅ Created 1 pending club (awaiting mentor approval)');

  // ==================== STEP 9: Approved Club (Coordinator created, Mentor approved) ====================
  const sportsClub = await prisma.club.create({
    data: {
      name: 'Sports & Fitness Club',
      description: 'Promoting physical fitness and sportsmanship through various activities.',
      category: 'Sports',
      imageUrl: 'https://ui-avatars.com/api/?name=Sports+Club&background=10b981&color=fff&size=128',
      createdBy: approvedCoordinator.id, // Created by coordinator
      mentorId: approvedMentor.id, // Assigned mentor
      approvalStatus: 'APPROVED', // Mentor approved
      reviewedAt: new Date(),
      isActive: true, // Now visible to all users
      members: {
        create: members.slice(0, 8).map(m => ({ userId: m.id })),
      },
      coordinators: {
        create: [{ userId: approvedCoordinator.id }],
      },
    },
  });
  console.log('✅ Created 1 approved club (coordinator created, mentor approved, visible to users)');

  // ==================== STEP 9: Create Sample Activities ====================
  await prisma.activity.create({
    data: {
      title: 'Basketball Tournament',
      description: 'Inter-club basketball competition',
      type: ActivityType.COMPETITION,
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      location: 'Sports Complex',
      status: ActivityStatus.UPCOMING,
      clubId: sportsClub.id,
    },
  });

  await prisma.activity.create({
    data: {
      title: 'Yoga Session',
      description: 'Morning yoga for beginners',
      type: ActivityType.WORKSHOP,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: 'Gymnasium',
      status: ActivityStatus.UPCOMING,
      clubId: sportsClub.id,
    },
  });
  console.log('✅ Created 2 activities');

  // ==================== STEP 10: Create Sample Quiz ====================
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Sports Trivia',
      description: 'Test your sports knowledge',
      clubId: sportsClub.id,
      timeLimit: 1200,
      totalMarks: 3,
      passingMarks: 2,
      isActive: true,
      questions: {
        create: [
          {
            text: 'How many players are on a basketball team?',
            type: 'MCQ',
            options: ['4', '5', '6', '7'],
            correctAnswer: ['5'],
            marks: 1,
            order: 1,
          },
          {
            text: 'What is the duration of a football match?',
            type: 'MCQ',
            options: ['60 minutes', '70 minutes', '90 minutes', '120 minutes'],
            correctAnswer: ['90 minutes'],
            marks: 1,
            order: 2,
          },
          {
            text: 'Which sport uses a shuttlecock?',
            type: 'MCQ',
            options: ['Tennis', 'Badminton', 'Squash', 'Table Tennis'],
            correctAnswer: ['Badminton'],
            marks: 1,
            order: 3,
          },
        ],
      },
    },
  });
  console.log('✅ Created 1 quiz');

  // ==================== STEP 11: Create Quiz Attempts ====================
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: members[0].id,
      score: 3,
      totalMarks: 3,
      percentage: 100,
      timeTaken: 600,
      answers: { q1: '5', q2: '90 minutes', q3: 'Badminton' },
      isPassed: true,
    },
  });
  console.log('✅ Created 1 quiz attempt');

  // ==================== STEP 12: Create Resources ====================
  await prisma.resource.create({
    data: {
      title: 'Fitness Training Guide',
      description: 'Complete guide to fitness training',
      type: 'PDF',
      url: 'https://example.com/fitness-guide.pdf',
      fileSize: 3145728,
      clubId: sportsClub.id,
      uploadedBy: approvedMentor.id,
    },
  });
  console.log('✅ Created 1 resource');

  // ==================== STEP 13: Create Comments ====================
  await prisma.comment.create({
    data: {
      clubId: sportsClub.id,
      userId: members[0].id,
      content: 'Great club activities! Looking forward to the tournament.',
      isAnonymous: false,
    },
  });

  await prisma.comment.create({
    data: {
      clubId: sportsClub.id,
      userId: members[1].id,
      content: 'Anonymous feedback: Need more morning sessions.',
      isAnonymous: true,
    },
  });
  console.log('✅ Created 2 comments');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log('  • 1 Admin (developer setup)');
  console.log('  • 15 Members (regular users)');
  console.log('  • 2 Pending Faculty Requests (awaiting admin approval)');
  console.log('  • 2 Pending Coordinator Requests (awaiting mentor approval)');
  console.log('  • 1 Approved Mentor (demonstration)');
  console.log('  • 1 Approved Coordinator (demonstration)');
  console.log('  • 1 Pending Club (coordinator created, awaiting mentor approval)');
  console.log('  • 1 Approved Club (visible to users, with activities, quiz, resources)');
  console.log('\n🔄 Updated Workflow:');
  console.log('  1. Admin approves Faculty requests → Users become FACULTY/Mentors');
  console.log('  2. Mentors approve Coordinator requests');
  console.log('  3. 🆕 COORDINATORS CREATE CLUBS (not mentors)');
  console.log('  4. 🆕 MENTORS REVIEW & APPROVE CLUBS');
  console.log('  5. 🆕 Only APPROVED clubs are visible to users');
  console.log('  6. Coordinators manage approved club activities');
  console.log('  7. Members join approved clubs and participate\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
