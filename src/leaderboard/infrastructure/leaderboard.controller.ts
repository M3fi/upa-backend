import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt/jwt-auth.guard';
import { LeaderboardEventHandler, LeaderboardEntry } from './leaderboard.event-handler';

@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(
    private readonly leaderboardHandler: LeaderboardEventHandler,
  ) {}

  @Get(':gameId')
  async getLeaderboard(
    @Param('gameId') gameId: string,
    @Query('limit') limit?: string,
  ) {
    const top = limit ? parseInt(limit, 10) : 10;
    const entries: LeaderboardEntry[] = await this.leaderboardHandler.getLeaderboard(gameId, top);

    return entries.map((entry) => ({
      studentId: entry.studentId,
      displayName: `Estudiante ${entry.rank}`,
      score: entry.score,
      rank: entry.rank,
    }));
  }
}
