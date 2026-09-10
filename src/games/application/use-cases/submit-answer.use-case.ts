import { Injectable, Inject } from '@nestjs/common';
import { IGameRepository } from '../../domain/ports/IGameRepository';
import { IPlayerScoreRepository } from '../../domain/ports/IPlayerScoreRepository';
import { PlayerScore } from '../../domain/entities/player-score.entity';
import { GameFactory } from '../../domain/engine/GameFactory';
import {
  AnswerSubmittedEvent,
  ScoreUpdatedEvent,
  domainEventBus,
} from '../../domain/events/domain-events';
import { randomUUID } from 'crypto';

export interface SubmitAnswerInput {
  studentId: string;
  gameId: string;
  questionIndex: number;
  answer: unknown;
  elapsedMs: number;
}

export interface SubmitAnswerOutput {
  isCorrect: boolean;
  scoreDelta: number;
  totalScore: number;
}

@Injectable()
export class SubmitAnswerUseCase {
  constructor(
    @Inject(IGameRepository) private readonly gameRepo: IGameRepository,
    @Inject(IPlayerScoreRepository) private readonly scoreRepo: IPlayerScoreRepository,
  ) {}

  async execute(input: SubmitAnswerInput): Promise<SubmitAnswerOutput> {
    const game = await this.gameRepo.findById(input.gameId);
    if (!game) {
      throw new Error('Juego no encontrado');
    }

    const template = GameFactory.get(game.templateType);
    const isCorrect = template.checkAnswer(game.content, input.questionIndex, input.answer);

    // ── Scoring formula ──
    // For sequences, use per-step rules
    let basePoints = game.rules?.basePoints ?? 100;
    let timeLimitSec = game.rules?.timeLimitSec ?? 60;

    if (game.templateType === 'Secuencia') {
      const seqContent = game.content as { steps?: Array<{ rules?: { basePoints?: number; timeLimitSec?: number } }> };
      const step = seqContent?.steps?.[input.questionIndex];
      if (step?.rules) {
        basePoints = step.rules.basePoints ?? basePoints;
        timeLimitSec = step.rules.timeLimitSec ?? timeLimitSec;
      }
    }

    const timeRatio = timeLimitSec > 0
      ? Math.max(0.3, 1 - (input.elapsedMs / 1000) / (timeLimitSec * 2))
      : 1;

    let scoreDelta = 0;
    if (game.templateType === 'SopaDeLetras') {
      // Word search: partial credit based on words found
      const answer = input.answer as { foundWords?: string[] };
      const content = game.content as { words?: string[] };
      const totalWords = content?.words?.length || 0;
      const foundCount = answer?.foundWords?.length || 0;
      const accuracy = totalWords > 0 ? foundCount / totalWords : 0;
      scoreDelta = Math.round(basePoints * accuracy * timeRatio);
    } else if (isCorrect) {
      scoreDelta = Math.round(basePoints * timeRatio);
    }

    const playerScore = new PlayerScore(
      randomUUID(),
      input.studentId,
      '',
      scoreDelta,
      new Date(),
    );
    await this.scoreRepo.save(playerScore);

    const totalScore = scoreDelta;

    const answerEvent = new AnswerSubmittedEvent(
      input.gameId,
      input.studentId,
      input.gameId,
      isCorrect,
      input.elapsedMs,
      0,
    );
    await domainEventBus.publish(answerEvent);

    const scoreEvent = new ScoreUpdatedEvent(
      input.gameId,
      input.studentId,
      input.gameId,
      scoreDelta,
      totalScore,
    );
    await domainEventBus.publish(scoreEvent);

    return { isCorrect, scoreDelta, totalScore };
  }
}
