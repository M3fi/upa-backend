import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface MultiSeleccionContent {
  questions: { prompt: string; options: { text: string; correct: boolean }[] }[];
}

export class MultiSeleccionTemplate implements IGameTemplate<MultiSeleccionContent, number[]> {
  readonly templateType = 'MultiSeleccion';
  validate(content: MultiSeleccionContent): void {
    if (!content.questions?.length) throw new Error('MultiSeleccion: questions requerido');
  }
  checkAnswer(content: MultiSeleccionContent, qi: number, answer: number[]): boolean {
    const q = content.questions[qi];
    if (!q) return false;
    const correct = q.options.map((o, i) => o.correct ? i : -1).filter(i => i >= 0);
    return JSON.stringify(answer.sort()) === JSON.stringify(correct.sort());
  }
  getScore(state: GameSessionState): number {
    return 150 * Math.max(1, state.streak);
  }
}
