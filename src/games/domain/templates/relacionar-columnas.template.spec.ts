import { RelacionarColumnasTemplate, RelacionarColumnasContent } from './relacionar-columnas.template';

describe('RelacionarColumnasTemplate', () => {
  const template = new RelacionarColumnasTemplate();

  const validContent: RelacionarColumnasContent = {
    pairs: [
      { left: 'Francia', right: 'París' },
      { left: 'Italia', right: 'Roma' },
      { left: 'Alemania', right: 'Berlín' },
    ],
  };

  describe('validate', () => {
    it('should accept valid content', () => {
      expect(() => template.validate(validContent)).not.toThrow();
    });

    it('should reject less than 2 pairs', () => {
      expect(() => template.validate({ pairs: [{ left: 'A', right: 'B' }] })).toThrow();
    });

    it('should reject empty left field', () => {
      expect(() => template.validate({ pairs: [{ left: '', right: 'B' }, { left: 'C', right: 'D' }] })).toThrow();
    });
  });

  describe('checkAnswer', () => {
    it('should accept correct mapping', () => {
      const result = template.checkAnswer(validContent, 0, {
        mappings: { 0: 0, 1: 1, 2: 2 },
      });
      expect(result).toBe(true);
    });

    it('should reject wrong mapping', () => {
      const result = template.checkAnswer(validContent, 0, {
        mappings: { 0: 1, 1: 0, 2: 2 },
      });
      expect(result).toBe(false);
    });
  });

  describe('getScore', () => {
    it('should return base points for normal speed', () => {
      const score = template.getScore({
        gameId: 'g1',
        studentId: 's1',
        answers: [],
        elapsedMs: 45000,
        livesLeft: 3,
        streak: 0,
      });
      expect(score).toBe(240); // 200 * 1.2
    });
  });
});
