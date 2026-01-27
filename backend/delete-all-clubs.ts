import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllClubs() {
  console.log('🗑️  Deleting all clubs and related data...\n');

  try {
    // Delete in order of dependencies
    console.log('Deleting club member removal requests...');
    await prisma.clubMemberRemovalRequest.deleteMany({});
    
    console.log('Deleting quiz attempts...');
    await prisma.quizAttempt.deleteMany({});
    
    console.log('Deleting quizzes...');
    await prisma.quiz.deleteMany({});
    
    console.log('Deleting comments...');
    await prisma.comment.deleteMany({});
    
    console.log('Deleting resources...');
    await prisma.resource.deleteMany({});
    
    console.log('Deleting activities...');
    await prisma.activity.deleteMany({});
    
    console.log('Deleting club coordinators...');
    await prisma.clubCoordinator.deleteMany({});
    
    console.log('Deleting club members...');
    await prisma.clubMember.deleteMany({});
    
    console.log('Deleting clubs...');
    const result = await prisma.club.deleteMany({});
    
    console.log('\n✅ Successfully deleted all clubs!');
    console.log(`   Total clubs removed: ${result.count}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error deleting clubs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllClubs()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
