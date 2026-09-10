import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface CompletarEspaciosContent { text: string; blanks: { index: number; correctAnswer: string }[]; }
export class CompletarEspaciosTemplate implements IGameTemplate<CompletarEspaciosContent, string[]> {
  readonly templateType = 'CompletarEspacios';
  validate(c: CompletarEspaciosContent): void {
    if (!c.text || !c.blanks?.length) throw new Error('CompletarEspacios: text y blanks requeridos');
  }
  checkAnswer(c: CompletarEspaciosContent, _qi: number, answer: string[]): boolean {
    return c.blanks.every((b, i) => b.correctAnswer.toLowerCase().trim() === (answer[i] || '').toLowerCase().trim());
  }
  getScore(s: GameSessionState): number { return 150; }
}
