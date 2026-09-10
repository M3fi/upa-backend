import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../leaderboard/infrastructure/redis.service';
import { GameFactory } from '../../domain/engine/GameFactory';
import { GameSessionState, AnswerRecord } from '../../domain/engine/IGameTemplate';

const SESSION_TTL = 2 * 60 * 60; // 2 hours in seconds

@Injectable()
export class GameSessionService {
  private readonly logger = new Logger(GameSessionService.name);

  constructor(private readonly redis: RedisService) {}

  async getOrCreate(gameId: string, studentId: string): Promise<GameSessionState> {
    const key = this.key(gameId, studentId);
    const raw = await this.redis.get(key);
    if (raw) {
      return JSON.parse(raw) as GameSessionState;
    }

    const session: GameSessionState = {
      gameId,
      studentId,
      answers: [],
      elapsedMs: 0,
      livesLeft: 3,
      streak: 0,
    };

    await this.save(session);
    return session;
  }

  async save(session: GameSessionState): Promise<void> {
    const key = this.key(session.gameId, session.studentId);
    await this.redis.set(key, JSON.stringify(session));
    await this.redis.expire(key, SESSION_TTL);
  }

  async checkAndRecord(
    gameId: string,
    studentId: string,
    templateType: string,
    content: unknown,
    questionIndex: number,
    answer: unknown,
    elapsedMs: number,
  ): Promise<{ isCorrect: boolean; scoreDelta: number; totalScore: number; session: GameSessionState }> {
    const template = GameFactory.get(templateType);
    const session = await this.getOrCreate(gameId, studentId);

    const isCorrect = template.checkAnswer(content, questionIndex, answer);
    session.elapsedMs = elapsedMs;
    session.streak = isCorrect ? session.streak + 1 : 0;
    if (!isCorrect) {
      session.livesLeft = Math.max(0, session.livesLeft - 1);
    }

    const record: AnswerRecord = {
      questionIndex,
      answer,
      isCorrect,
      elapsedMs,
      timestamp: new Date(),
    };
    session.answers.push(record);

    const scoreDelta = template.getScore(session);
    const totalScore = this.calcTotal(session);

    await this.save(session);

    return { isCorrect, scoreDelta, totalScore, session };
  }

  private calcTotal(session: GameSessionState): number {
    return session.answers.reduce((sum, a) => {
      return sum + (a.isCorrect ? 100 : 0);
    }, 0);
  }

  private key(gameId: string, studentId: string): string {
    return `session:${gameId}:${studentId}`;
  }
}
