import { Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from './infrastructure/redis.service';
import { LeaderboardEventHandler } from './infrastructure/leaderboard.event-handler';
import { LeaderboardController } from './infrastructure/leaderboard.controller';
import { LeaderboardGateway } from './infrastructure/leaderboard.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [LeaderboardController],
  imports: [AuthModule],
  providers: [
    RedisService,
    LeaderboardEventHandler,
    LeaderboardGateway,
  ],
  exports: [RedisService, LeaderboardEventHandler],
})
export class LeaderboardModule implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly eventHandler: LeaderboardEventHandler,
  ) {}

  async onModuleInit() {
    // Ensure Redis connects on startup
    await this.redisService.onModuleInit();
  }
}
