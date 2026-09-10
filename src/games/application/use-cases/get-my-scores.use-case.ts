import { Injectable, Inject } from '@nestjs/common';
import { IPlayerScoreRepository } from '../../domain/ports/IPlayerScoreRepository';

@Injectable()
export class GetMyScoresUseCase {
  constructor(
    @Inject(IPlayerScoreRepository) private readonly scoreRepo: IPlayerScoreRepository,
  ) {}

  async execute(studentId: string) {
    const scores = await this.scoreRepo.findByStudentId(studentId);
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const gamesPlayed = scores.length;
    return {
      totalScore,
      gamesPlayed,
      scores: scores.map(s => ({
        gameId: s.gameId,
        score: s.score,
        completedAt: s.completedAt,
      })),
    };
  }
}
