import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface SopaDeLetrasContent {
  words: string[];
  gridSize: number;
  topic: string;
}

export interface SopaDeLetrasAnswer {
  /** Palabras encontradas (en orden) */
  foundWords: string[];
}

export class SopaDeLetrasTemplate implements IGameTemplate<SopaDeLetrasContent, SopaDeLetrasAnswer> {
  readonly templateType = 'SopaDeLetras';

  validate(content: SopaDeLetrasContent): void {
    if (!content.words || !Array.isArray(content.words)) {
      throw new Error('SopaDeLetras: content.words debe ser un array');
    }
    if (content.words.length < 3) {
      throw new Error('SopaDeLetras: debe tener al menos 3 palabras');
    }
    if (typeof content.gridSize !== 'number' || content.gridSize < 5) {
      throw new Error('SopaDeLetras: gridSize debe ser >= 5');
    }
  }

  checkAnswer(content: SopaDeLetrasContent, questionIndex: number, answer: SopaDeLetrasAnswer): boolean {
    const correctWords = new Set(content.words.map(w => w.toLowerCase()));
    const foundWordsSet = new Set(answer.foundWords.map(w => w.toLowerCase()));

    // Returns true if ALL words are found (one-shot check per questionIndex)
    return Array.from(correctWords).every(word => foundWordsSet.has(word))
      && foundWordsSet.size >= correctWords.size;
  }

  getScore(state: GameSessionState): number {
    const basePoints = 300;
    const accuracy = state.answers.length > 0
      ? state.answers.filter(a => a.isCorrect).length / state.answers.length
      : 0;
    return Math.round(basePoints * accuracy);
  }
}
