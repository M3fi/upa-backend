import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface EncuentraErrorContent { text: string; errors: { position: number; expected: string }[]; }
export class EncuentraErrorTemplate implements IGameTemplate<EncuentraErrorContent, number[]> {
  readonly templateType = 'EncuentraError';
  validate(c: EncuentraErrorContent): void {
    if (!c.text || !c.errors?.length) throw new Error('EncuentraError: text y errors requeridos');
  }
  checkAnswer(c: EncuentraErrorContent, _qi: number, answer: number[]): boolean {
    const correctPositions = c.errors.map(e => e.position).sort();
    return JSON.stringify(answer.sort()) === JSON.stringify(correctPositions);
  }
  getScore(s: GameSessionState): number { return 200; }
}
