import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  domainEventBus,
  AnswerSubmittedEvent,
  ScoreUpdatedEvent,
  StreakAchievedEvent,
} from '../../games/domain/events/domain-events';
import { IPlayerScoreRepository } from '../../games/domain/ports/IPlayerScoreRepository';
import { PlayerScore } from '../../games/domain/entities/player-score.entity';
import { randomUUID } from 'crypto';

export interface ScoreFormulaParams {
  basePoints: number;
  elapsedMs: number;
  streak: number;
  livesLeft: number;
  isCorrect: boolean;
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    @Inject(IPlayerScoreRepository)
    private readonly scoreRepo: IPlayerScoreRepository,
  ) {
    domainEventBus.subscribe('AnswerSubmitted', async (event) => {
      if (event instanceof AnswerSubmittedEvent) {
        await this.handleAnswerSubmitted(event);
      }
    });
  }

  /**
   * Fórmula de puntaje: base × speedMultiplier × streakBonus × (0 si sin vidas)
   */
  calculate(params: ScoreFormulaParams): number {
    if (!params.isCorrect) return 0;
    if (params.livesLeft <= 0) return 0;

    const speedMultiplier =
      params.elapsedMs < 5000 ? 1.5 :
      params.elapsedMs < 15000 ? 1.2 :
      1.0;

    const streakBonus = 1 + Math.min(params.streak, 10) * 0.1;

    return Math.round(params.basePoints * speedMultiplier * streakBonus);
  }

  private async handleAnswerSubmitted(event: AnswerSubmittedEvent): Promise<void> {
    const scoreDelta = this.calculate({
      basePoints: 100,
      elapsedMs: event.elapsedMs,
      streak: event.streak,
      livesLeft: 3,
      isCorrect: event.isCorrect,
    });

    // Calculate total score (append-only)
    const totalScore = scoreDelta; // Simplified for M0

    // Persist score
    const playerScore = new PlayerScore(
      randomUUID(),
      event.studentId,
      '', // assignmentId
      scoreDelta,
      new Date(),
    );
    await this.scoreRepo.save(playerScore);

    // Publish ScoreUpdated
    const scoreEvent = new ScoreUpdatedEvent(
      event.gameId,
      event.studentId,
      event.gameId,
      scoreDelta,
      totalScore,
    );
    await domainEventBus.publish(scoreEvent);

    // Publish StreakAchieved if streak >= 3
    if (event.streak >= 3) {
      const streakEvent = new StreakAchievedEvent(
        event.gameId,
        event.studentId,
        event.streak,
      );
      await domainEventBus.publish(streakEvent);
    }

    this.logger.debug(`Score: student=${event.studentId} delta=${scoreDelta} total=${totalScore}`);
  }
}
