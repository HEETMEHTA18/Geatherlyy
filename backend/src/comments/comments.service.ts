import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment, Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });
  }

  async findAll(filters?: {
    clubId?: number;
    isAnonymous?: boolean;
    skip?: number;
    take?: number;
  }): Promise<Comment[]> {
    const where: Prisma.CommentWhereInput = {};

    if (filters?.clubId) {
      where.clubId = filters.clubId;
    }

    if (filters?.isAnonymous !== undefined) {
      where.isAnonymous = filters.isAnonymous;
    }

    return this.prisma.comment.findMany({
      where,
      skip: filters?.skip,
      take: filters?.take || 50,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        club: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Hide user details if anonymous
    if (comment.isAnonymous) {
      comment.user = null;
    }

    return comment;
  }

  async update(id: number, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data,
      include: {
        club: true,
        user: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async getClubComments(clubId: number, includeAnonymous: boolean = true): Promise<Comment[]> {
    const comments = await this.findAll({
      clubId,
      skip: 0,
      take: 100,
    });

    // Mask user data for anonymous comments
    return comments.map(comment => {
      if (comment.isAnonymous) {
        return {
          ...comment,
          user: null,
        };
      }
      return comment;
    });
  }

  async canUserModifyComment(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return false;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    // Only the author or admin can modify
    return comment.userId === userId || user.role === 'ADMIN';
  }
}


