import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface SiONoContent {
  questions: { prompt: string; answer: boolean }[];
}

export interface SiONoAnswer {
  value: boolean;
}

export class SiONoTemplate implements IGameTemplate<SiONoContent, boolean> {
  readonly templateType = 'SiONo';

  validate(content: SiONoContent): void {
    if (!content.questions || !Array.isArray(content.questions)) {
      throw new Error('SiONo: content.questions debe ser un array');
    }
    if (content.questions.length === 0) {
      throw new Error('SiONo: debe tener al menos 1 pregunta');
    }
    for (let i = 0; i < content.questions.length; i++) {
      const q = content.questions[i];
      if (typeof q.prompt !== 'string' || q.prompt.trim() === '') {
        throw new Error(`SiONo: pregunta[${i}] debe tener un prompt no vacío`);
      }
      if (typeof q.answer !== 'boolean') {
        throw new Error(`SiONo: pregunta[${i}] answer debe ser boolean`);
      }
    }
  }

  checkAnswer(content: SiONoContent, questionIndex: number, answer: boolean): boolean {
    const question = content.questions[questionIndex];
    if (!question) return false;
    return question.answer === answer;
  }

  getScore(state: GameSessionState): number {
    const basePoints = 100;
    const speedBonus = state.elapsedMs < 5000 ? 1.5 : state.elapsedMs < 15000 ? 1.2 : 1.0;
    const streakBonus = 1 + Math.min(state.streak, 5) * 0.1;
    return Math.round(basePoints * speedBonus * streakBonus);
  }
}
