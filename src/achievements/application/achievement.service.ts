import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  domainEventBus,
  GameCompletedEvent,
  StreakAchievedEvent,
  AchievementUnlockedEvent,
} from '../../games/domain/events/domain-events';
import { AchievementOrmEntity } from '../../games/infrastructure/repositories/achievement.orm-entity';
import { StudentAchievementOrmEntity } from '../../games/infrastructure/repositories/student-achievement.orm-entity';

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  constructor(
    @InjectRepository(AchievementOrmEntity)
    private readonly achievementRepo: Repository<AchievementOrmEntity>,
    @InjectRepository(StudentAchievementOrmEntity)
    private readonly studentAchievementRepo: Repository<StudentAchievementOrmEntity>,
  ) {
    domainEventBus.subscribe('GameCompleted', async (event) => {
      if (event instanceof GameCompletedEvent) {
        await this.checkGameAchievements(event);
      }
    });
    domainEventBus.subscribe('StreakAchieved', async (event) => {
      if (event instanceof StreakAchievedEvent) {
        await this.checkStreakAchievements(event);
      }
    });
  }

  async seedAchievements(): Promise<void> {
    const existing = await this.achievementRepo.count();
    if (existing > 0) return;

    const achievements = [
      { code: 'first_game', name: 'Primer juego', rarity: 'common', criteria: { type: 'gamesPlayed', count: 1 } },
      { code: 'streak_3', name: 'Racha de 3', rarity: 'common', criteria: { type: 'streak', count: 3 } },
      { code: 'streak_5', name: 'Racha de 5', rarity: 'rare', criteria: { type: 'streak', count: 5 } },
      { code: 'streak_10', name: 'Racha imparable', rarity: 'epic', criteria: { type: 'streak', count: 10 } },
      { code: 'score_1000', name: 'Centenario', rarity: 'common', criteria: { type: 'totalScore', count: 1000 } },
      { code: 'perfect_game', name: 'Juego perfecto', rarity: 'legendary', criteria: { type: 'perfectGame', count: 1 } },
    ];

    for (const a of achievements) {
      await this.achievementRepo.save({
        id: randomUUID(),
        code: a.code,
        name: a.name,
        rarity: a.rarity,
        criteria: a.criteria as Record<string, unknown>,
      });
    }
    this.logger.log(`Seeded ${achievements.length} achievements`);
  }

  private async checkGameAchievements(event: GameCompletedEvent): Promise<void> {
    const achievements = await this.achievementRepo.find();
    for (const ach of achievements) {
      if (ach.code === 'first_game') {
        await this.unlock(event.studentId, ach.id);
      }
      if (ach.code === 'perfect_game' && event.perfect) {
        await this.unlock(event.studentId, ach.id);
      }
    }
  }

  private async checkStreakAchievements(event: StreakAchievedEvent): Promise<void> {
    const achievements = await this.achievementRepo.find();
    for (const ach of achievements) {
      if (ach.code === `streak_${event.streakLength}`) {
        await this.unlock(event.studentId, ach.id);
      }
    }
  }

  private async unlock(studentId: string, achievementId: string): Promise<void> {
    const existing = await this.studentAchievementRepo.findOne({
      where: { studentId, achievementId },
    });
    if (existing) return;

    await this.studentAchievementRepo.save({
      studentId,
      achievementId,
      unlockedAt: new Date(),
    });

    const ach = await this.achievementRepo.findOne({ where: { id: achievementId } });
    const unlockEvent = new AchievementUnlockedEvent(
      achievementId,
      studentId,
      achievementId,
      ach?.rarity || 'common',
    );
    await domainEventBus.publish(unlockEvent);
    this.logger.log(`Achievement unlocked: ${ach?.name} for student ${studentId}`);
  }
}
