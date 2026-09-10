import { SopaDeLetrasTemplate, SopaDeLetrasContent } from './sopa-de-letras.template';

describe('SopaDeLetrasTemplate', () => {
  const template = new SopaDeLetrasTemplate();

  const validContent: SopaDeLetrasContent = {
    words: ['CASA', 'PERRO', 'GATO', 'SOL'],
    gridSize: 10,
    topic: 'animales',
  };

  describe('validate', () => {
    it('should accept valid content', () => {
      expect(() => template.validate(validContent)).not.toThrow();
    });

    it('should reject less than 3 words', () => {
      expect(() => template.validate({ words: ['A'], gridSize: 10, topic: 'test' })).toThrow();
    });

    it('should reject small grid', () => {
      expect(() => template.validate({ words: ['A', 'B', 'C'], gridSize: 3, topic: 'test' })).toThrow();
    });
  });

  describe('checkAnswer', () => {
    it('should accept when all words found', () => {
      const result = template.checkAnswer(validContent, 0, {
        foundWords: ['CASA', 'PERRO', 'GATO', 'SOL'],
      });
      expect(result).toBe(true);
    });

    it('should reject when some words missing', () => {
      const result = template.checkAnswer(validContent, 0, {
        foundWords: ['CASA', 'PERRO'],
      });
      expect(result).toBe(false);
    });

    it('should be case insensitive', () => {
      const result = template.checkAnswer(validContent, 0, {
        foundWords: ['casa', 'perro', 'gato', 'sol'],
      });
      expect(result).toBe(true);
    });
  });

  describe('getScore', () => {
    it('should return max points for perfect score', () => {
      const score = template.getScore({
        gameId: 'g1',
        studentId: 's1',
        answers: [
          { questionIndex: 0, answer: {}, isCorrect: true, elapsedMs: 1000, timestamp: new Date() },
          { questionIndex: 0, answer: {}, isCorrect: true, elapsedMs: 1000, timestamp: new Date() },
        ],
        elapsedMs: 60000,
        livesLeft: 3,
        streak: 2,
      });
      expect(score).toBe(300);
    });
  });
});
