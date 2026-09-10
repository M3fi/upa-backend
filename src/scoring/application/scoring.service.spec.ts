import { ScoringService, ScoreFormulaParams } from './scoring.service';
import { IPlayerScoreRepository } from '../../games/domain/ports/IPlayerScoreRepository';
import { PlayerScore } from '../../games/domain/entities/player-score.entity';

describe('ScoringService', () => {
  let service: ScoringService;
  let mockRepo: jest.Mocked<IPlayerScoreRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByStudentIdAndAssignmentId: jest.fn(),
      findByAssignmentId: jest.fn(),
      findByGameId: jest.fn(),
      findByStudentId: jest.fn(),
    };
    service = new ScoringService(mockRepo);
  });

  const base: ScoreFormulaParams = {
    basePoints: 100,
    elapsedMs: 10000,
    streak: 0,
    livesLeft: 3,
    isCorrect: true,
  };

  it('should return 0 for incorrect answers', () => {
    expect(service.calculate({ ...base, isCorrect: false })).toBe(0);
  });

  it('should return 0 when no lives left', () => {
    expect(service.calculate({ ...base, livesLeft: 0 })).toBe(0);
  });

  it('should apply speed bonus for fast answers (<5s)', () => {
    const score = service.calculate({ ...base, elapsedMs: 3000 });
    expect(score).toBe(150); // 100 * 1.5
  });

  it('should apply medium speed bonus (<15s)', () => {
    const score = service.calculate({ ...base, elapsedMs: 10000 });
    expect(score).toBe(120); // 100 * 1.2
  });

  it('should apply no speed bonus for slow answers', () => {
    const score = service.calculate({ ...base, elapsedMs: 30000 });
    expect(score).toBe(100);
  });

  it('should apply streak bonus', () => {
    const score = service.calculate({ ...base, streak: 5 });
    expect(score).toBe(180); // 100 * 1.2 * 1.5
  });

  it('should cap streak bonus at 10', () => {
    const score = service.calculate({ ...base, streak: 20 });
    expect(score).toBe(240); // 100 * 1.2 * 2.0
  });

  it('matrix: speed=fast streak=3 lives=3 correct=true', () => {
    const score = service.calculate({
      basePoints: 100, elapsedMs: 3000, streak: 3, livesLeft: 3, isCorrect: true,
    });
    expect(score).toBe(195); // 100 * 1.5 * 1.3 = 195
  });

  it('matrix: speed=slow streak=0 lives=1 correct=true', () => {
    const score = service.calculate({
      basePoints: 100, elapsedMs: 20000, streak: 0, livesLeft: 1, isCorrect: true,
    });
    expect(score).toBe(100);
  });

  it('matrix: speed=fast streak=10 lives=0 correct=true', () => {
    const score = service.calculate({
      basePoints: 100, elapsedMs: 3000, streak: 10, livesLeft: 0, isCorrect: true,
    });
    expect(score).toBe(0); // No lives = 0
  });
});
