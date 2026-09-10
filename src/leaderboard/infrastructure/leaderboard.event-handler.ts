import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { domainEventBus, ScoreUpdatedEvent } from '../../games/domain/events/domain-events';

export interface LeaderboardEntry {
  studentId: string;
  score: number;
  rank: number;
}

@Injectable()
export class LeaderboardEventHandler {
  private readonly logger = new Logger(LeaderboardEventHandler.name);

  constructor(private readonly redis: RedisService) {
    domainEventBus.subscribe('ScoreUpdated', async (event) => {
      if (event instanceof ScoreUpdatedEvent) {
        await this.handleScoreUpdated(event);
      }
    });
  }

  private async handleScoreUpdated(event: ScoreUpdatedEvent): Promise<void> {
    const key = `lb:game:${event.gameId}`;
    await this.redis.zadd(key, event.newTotal, event.studentId);
    this.logger.log(`Leaderboard updated: game=${event.gameId}, student=${event.studentId}, score=${event.newTotal}`);
  }

  async getLeaderboard(gameId: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    const key = `lb:game:${gameId}`;
    const results = await this.redis.zrevrange(key, 0, limit - 1);

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < results.length - 1; i += 2) {
      entries.push({
        studentId: results[i],
        score: parseInt(results[i + 1], 10) || 0,
        rank: Math.floor(i / 2) + 1,
      });
    }
    return entries;
  }
}
