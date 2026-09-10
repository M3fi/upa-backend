import { PlayerScore } from '../entities/player-score.entity';

export const IPlayerScoreRepository = Symbol('IPlayerScoreRepository');

export interface IPlayerScoreRepository {
  save(score: PlayerScore): Promise<PlayerScore>;
  findByStudentIdAndAssignmentId(studentId: string, assignmentId: string): Promise<PlayerScore | null>;
  findByAssignmentId(assignmentId: string): Promise<PlayerScore[]>;
  findByGameId(gameId: string): Promise<PlayerScore[]>;
  findByStudentId(studentId: string): Promise<PlayerScore[]>;
}
