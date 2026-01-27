import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../cache/redis.service';
import { Quiz, QuizAttempt, Prisma } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(data: Prisma.QuizCreateInput): Promise<Quiz> {
    const quiz = await this.prisma.quiz.create({
      data,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        questions: true,
      },
    });

    // Invalidate cache
    await this.redis.del(`club:${quiz.clubId}:quizzes`);

    return quiz;
  }

  async findAll(filters?: {
    clubId?: number;
    skip?: number;
    take?: number;
  }): Promise<Quiz[]> {
    const where: Prisma.QuizWhereInput = {};

    if (filters?.clubId) {
      where.clubId = filters.clubId;
    }

    return this.prisma.quiz.findMany({
      where,
      skip: filters?.skip,
      take: filters?.take || 20,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            category: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number, includeAnswers: boolean = false): Promise<Quiz> {
    const cacheKey = `quiz:${id}:${includeAnswers}`;
    const cached = await this.redis.getQuizData(cacheKey);

    if (cached) {
      return cached as any;
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            correctAnswer: includeAnswers, // Only include if allowed
            marks: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    await this.redis.setQuizData(cacheKey, quiz);

    return quiz;
  }

  async update(id: number, data: Prisma.QuizUpdateInput): Promise<Quiz> {
    const quiz = await this.prisma.quiz.update({
      where: { id },
      data,
      include: {
        club: true,
        questions: true,
      },
    });

    // Invalidate cache
    await this.redis.del(`quiz:${id}:true`);
    await this.redis.del(`quiz:${id}:false`);
    await this.redis.del(`club:${quiz.clubId}:quizzes`);

    return quiz;
  }

  async delete(id: number): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    // Invalidate cache
    await this.redis.del(`quiz:${id}:true`);
    await this.redis.del(`quiz:${id}:false`);
    await this.redis.del(`club:${quiz.clubId}:quizzes`);
  }

  async submitQuizAttempt(
    quizId: number,
    userId: number,
    answers: Record<number, number>, // questionId -> selectedOption
  ): Promise<QuizAttempt> {
    const quiz = await this.findById(quizId, true);

    // Check if quiz has time limit and if user has ongoing attempt
    const existingAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        quizId,
        userId,
        score: null,
      },
    });

    if (existingAttempt && quiz.timeLimit) {
      const timePassed = Date.now() - existingAttempt.attemptedAt.getTime();
      if (timePassed > quiz.timeLimit * 60 * 1000) {
        throw new BadRequestException('Time limit exceeded');
      }
    }

    // Calculate score
    let score = 0;
    const results: any[] = [];

    for (const question of (quiz as any).questions) {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.marks;
      }

      results.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.marks : 0,
      });
    }

    // Create or update attempt
    const attempt = await this.prisma.quizAttempt.upsert({
      where: {
        quizId_userId: {
          quizId,
          userId,
        },
      },
      update: {
        score,
        attemptedAt: new Date(),
      },
      create: {
        quizId,
        userId,
        score,
        totalMarks: (quiz as any).totalMarks || 100,
        percentage: ((quiz as any).totalMarks ? (score / (quiz as any).totalMarks) * 100 : 0),
        timeTaken: 0,
        answers: {},
        isPassed: false,
        attemptedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            clubId: true,
          },
        },
      },
    });

    // Invalidate leaderboard cache
    await this.redis.del('leaderboard:global');
    await this.redis.del(`leaderboard:club:${quiz.clubId}`);

    return attempt;
  }

  async getUserAttempt(quizId: number, userId: number): Promise<QuizAttempt | null> {
    return this.prisma.quizAttempt.findUnique({
      where: {
        quizId_userId: {
          quizId,
          userId,
        },
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
  }

  async getQuizLeaderboard(quizId: number, limit: number = 10): Promise<any[]> {
    const cacheKey = `quiz:${quizId}:leaderboard:${limit}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached as string);
    }

    // Ranking: Higher score first, then faster completion time
    const leaderboard = await this.prisma.quizAttempt.findMany({
      where: {
        quizId,
        attemptedAt: { not: null },
      },
      take: limit,
      orderBy: [
        { score: 'desc' },
        { timeTaken: 'asc' },
        { attemptedAt: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            totalMarks: true,
          },
        },
      },
    });

    const formattedLeaderboard = leaderboard.map((attempt, index) => ({
      rank: index + 1,
      userId: attempt.user.id,
      name: attempt.user.name,
      avatar: attempt.user.avatar,
      email: attempt.user.email,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      attemptedAt: attempt.attemptedAt,
    }));

    await this.redis.set(cacheKey, JSON.stringify(formattedLeaderboard), 300); // 5 minutes

    return formattedLeaderboard;
  }

  async getQuizStats(quizId: number): Promise<any> {
    const [totalAttempts, avgScore, maxScore] = await this.prisma.$transaction([
      this.prisma.quizAttempt.count({
        where: {
          quizId,
          attemptedAt: { not: null },
        },
      }),
      this.prisma.quizAttempt.aggregate({
        where: {
          quizId,
          attemptedAt: { not: null },
        },
        _avg: {
          score: true,
        },
      }),
      this.prisma.quizAttempt.aggregate({
        where: {
          quizId,
          attemptedAt: { not: null },
        },
        _max: {
          score: true,
        },
      }),
    ]);

    return {
      totalAttempts,
      averageScore: avgScore._avg.score || 0,
      maxScore: maxScore._max.score || 0,
    };
  }
}




