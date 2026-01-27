import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardsService } from './leaderboards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('leaderboards')
@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get('global')
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiResponse({ status: 200, description: 'Returns global leaderboard' })
  async getGlobalLeaderboard(@Query('limit') limit?: number) {
    return this.leaderboardsService.getGlobalLeaderboard(limit);
  }

  @Get('club/:clubId')
  @ApiOperation({ summary: 'Get club-specific leaderboard' })
  @ApiResponse({ status: 200, description: 'Returns club leaderboard' })
  async getClubLeaderboard(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query('limit') limit?: number,
  ) {
    return this.leaderboardsService.getClubLeaderboard(clubId, limit);
  }

  @Get('my-rank')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user rank' })
  @ApiResponse({ status: 200, description: 'Returns user rank and stats' })
  async getMyRank(@Request() req) {
    return this.leaderboardsService.getUserRank(req.user.id);
  }

  @Get('global/export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export global leaderboard to Excel' })
  @ApiResponse({ status: 200, description: 'Returns Excel file' })
  async exportGlobalLeaderboard(@Res() res: Response) {
    const buffer = await this.leaderboardsService.exportGlobalLeaderboard();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Global_Leaderboard_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  }

  @Get('club/:clubId/export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export club leaderboard to Excel' })
  @ApiResponse({ status: 200, description: 'Returns Excel file' })
  async exportClubLeaderboard(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.leaderboardsService.exportClubLeaderboard(clubId);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Club_${clubId}_Leaderboard_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  }
}


