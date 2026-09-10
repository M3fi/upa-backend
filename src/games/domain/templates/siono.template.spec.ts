import { SiONoTemplate, SiONoContent } from './siono.template';

describe('SiONoTemplate', () => {
  const template = new SiONoTemplate();

  const validContent: SiONoContent = {
    questions: [
      { prompt: 'El cielo es azul', answer: true },
      { prompt: '2+2=5', answer: false },
    ],
  };

  describe('validate', () => {
    it('should accept valid content', () => {
      expect(() => template.validate(validContent)).not.toThrow();
    });

    it('should reject empty questions', () => {
      expect(() => template.validate({ questions: [] })).toThrow();
    });

    it('should reject missing questions', () => {
      expect(() => template.validate({} as SiONoContent)).toThrow();
    });

    it('should reject question without prompt', () => {
      const bad = { questions: [{ answer: true }] };
      expect(() => template.validate(bad as SiONoContent)).toThrow();
    });

    it('should reject question with non-boolean answer', () => {
      const bad = { questions: [{ prompt: 'test', answer: 'yes' }] };
      expect(() => template.validate(bad as unknown as SiONoContent)).toThrow();
    });
  });

  describe('checkAnswer', () => {
    it('should return true for correct answer', () => {
      expect(template.checkAnswer(validContent, 0, true)).toBe(true);
      expect(template.checkAnswer(validContent, 1, false)).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      expect(template.checkAnswer(validContent, 0, false)).toBe(false);
      expect(template.checkAnswer(validContent, 1, true)).toBe(false);
    });

    it('should return false for invalid index', () => {
      expect(template.checkAnswer(validContent, 99, true)).toBe(false);
    });
  });

  describe('getScore', () => {
    it('should return base points for medium speed', () => {
      const score = template.getScore({
        gameId: 'g1',
        studentId: 's1',
        answers: [{ questionIndex: 0, answer: true, isCorrect: true, elapsedMs: 10000, timestamp: new Date() }],
        elapsedMs: 10000,
        livesLeft: 3,
        streak: 1,
      });
      expect(score).toBe(132); // 100 * 1.2 * 1.1 (streak bonus)
    });

    it('should give speed bonus for fast answers', () => {
      const score = template.getScore({
        gameId: 'g1',
        studentId: 's1',
        answers: [],
        elapsedMs: 3000,
        livesLeft: 3,
        streak: 0,
      });
      expect(score).toBeGreaterThan(100);
    });
  });
});
