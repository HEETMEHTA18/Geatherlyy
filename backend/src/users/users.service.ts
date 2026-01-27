import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, UserRole } from '@prisma/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        memberOfClubs: {
          include: {
            club: true,
          },
        },
        coordinatedClubs: {
          include: {
            club: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findAll(filters?: {
    role?: UserRole;
    skip?: number;
    take?: number;
  }): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    return this.prisma.user.findMany({
      where,
      skip: filters?.skip,
      take: filters?.take || 50,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.password && typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateApprovalStatus(id: number, status: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { approvalStatus: status as any },
    });
  }

  async updateLastLogin(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserStats(userId: number): Promise<any> {
    const [joinedClubs, quizAttempts, totalScore] = await Promise.all([
      this.prisma.clubMember.count({
        where: { userId },
      }),
      this.prisma.quizAttempt.count({
        where: { userId },
      }),
      this.prisma.quizAttempt.aggregate({
        where: { userId },
        _sum: {
          score: true,
        },
      }),
    ]);

    return {
      joinedClubs,
      quizAttempts,
      totalScore: totalScore._sum.score || 0,
    };
  }
}


