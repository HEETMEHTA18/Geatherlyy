import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPlatformAnalytics() {
    const [
      totalUsers,
      activeClubs,
      totalActivities,
      pendingApprovals,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.club.count({ where: { approvalStatus: 'APPROVED' } }),
      this.prisma.activity.count(),
      this.prisma.approvalRequest.count({ where: { status: 'PENDING' } }),
    ]);

    // Get top clubs by member count
    const topClubs = await this.prisma.club.findMany({
      where: { approvalStatus: 'APPROVED' },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: {
        members: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return {
      totalUsers,
      activeClubs,
      totalActivities,
      pendingApprovals,
      newClubs: 0, // Could calculate based on recent clubs
      userGrowth: '↑ 0%',
      avgAttendance: 0,
      engagementRate: 0,
      engagementChange: '↑ 0%',
      topClubs: topClubs.map((club) => ({
        id: club.id,
        name: club.name,
        members: club._count.members,
      })),
    };
  }
}
