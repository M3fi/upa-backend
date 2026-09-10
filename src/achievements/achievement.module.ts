import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementService } from './application/achievement.service';
import { AchievementOrmEntity } from '../games/infrastructure/repositories/achievement.orm-entity';
import { StudentAchievementOrmEntity } from '../games/infrastructure/repositories/student-achievement.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AchievementOrmEntity, StudentAchievementOrmEntity]),
  ],
  providers: [AchievementService],
})
export class AchievementModule implements OnModuleInit {
  constructor(private readonly achievementService: AchievementService) {}

  async onModuleInit() {
    await this.achievementService.seedAchievements();
  }
}
