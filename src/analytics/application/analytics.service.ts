import { Injectable, Logger } from '@nestjs/common';
import {
  domainEventBus,
  AnswerSubmittedEvent,
  GameCompletedEvent,
  AchievementUnlockedEvent,
  ScoreUpdatedEvent,
} from '../../games/domain/events/domain-events';

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private eventBuffer: AnalyticsEvent[] = [];

  constructor() {
    // Subscribe to all game events for analytics
    domainEventBus.subscribe('AnswerSubmitted', async (event) => {
      if (event instanceof AnswerSubmittedEvent) {
        this.record({
          eventName: 'answer_submitted',
          payload: {
            studentId: event.studentId,
            gameId: event.gameId,
            isCorrect: event.isCorrect,
            elapsedMs: event.elapsedMs,
            streak: event.streak,
          },
        });
      }
    });

    domainEventBus.subscribe('ScoreUpdated', async (event) => {
      if (event instanceof ScoreUpdatedEvent) {
        this.record({
          eventName: 'score_updated',
          payload: {
            studentId: event.studentId,
            gameId: event.gameId,
            delta: event.delta,
            total: event.newTotal,
          },
        });
      }
    });

    domainEventBus.subscribe('GameCompleted', async (event) => {
      if (event instanceof GameCompletedEvent) {
        this.record({
          eventName: 'game_completed',
          payload: {
            studentId: event.studentId,
            gameId: event.gameId,
            finalScore: event.finalScore,
            perfect: event.perfect,
          },
        });
      }
    });

    domainEventBus.subscribe('AchievementUnlocked', async (event) => {
      if (event instanceof AchievementUnlockedEvent) {
        this.record({
          eventName: 'achievement_unlocked',
          payload: {
            studentId: event.studentId,
            achievementId: event.achievementId,
            rarity: event.rarity,
          },
        });
      }
    });

    // Flush buffer every 30 seconds
    setInterval(() => this.flush(), 30000);
  }

  private record(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    this.eventBuffer.push({
      ...event,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Analytics: ${event.eventName}`);
  }

  /** Flush buffer to persistent store (ClickHouse in production) */
  async flush(): Promise<void> {
    if (this.eventBuffer.length === 0) return;
    const batch = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      // In dev: log to console. In prod: POST to ClickHouse / Kafka
      this.logger.log(`Analytics flush: ${batch.length} events`);
      for (const event of batch) {
        this.logger.verbose(JSON.stringify(event));
      }
    } catch (err) {
      this.logger.error('Analytics flush failed', err);
      // Re-queue on failure
      this.eventBuffer.push(...batch);
    }
  }

  /** Report generation helpers */
  async getGameStats(gameId: string): Promise<{
    totalPlays: number;
    averageScore: number;
    completionRate: number;
  }> {
    // In production: query ClickHouse
    return { totalPlays: 0, averageScore: 0, completionRate: 0 };
  }

  async getStudentActivity(studentId: string): Promise<{
    gamesPlayed: number;
    achievementsUnlocked: number;
    totalScore: number;
    averageTimePerQuestion: number;
  }> {
    return { gamesPlayed: 0, achievementsUnlocked: 0, totalScore: 0, averageTimePerQuestion: 0 };
  }
}
