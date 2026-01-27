import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClubsModule } from './clubs/clubs.module';
import { ActivitiesModule } from './activities/activities.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { ResourcesModule } from './resources/resources.module';
import { CommentsModule } from './comments/comments.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './cache/redis.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Core modules
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ClubsModule,
    ActivitiesModule,
    QuizzesModule,
    LeaderboardsModule,
    ResourcesModule,
    CommentsModule,
    ApprovalsModule,
    AnalyticsModule,
    UploadModule,
  ],
})
export class AppModule {}


