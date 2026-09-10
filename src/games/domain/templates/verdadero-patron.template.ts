import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface VerdaderoPatronContent { sequence: number[]; nextNumber: number; }
export class VerdaderoPatronTemplate implements IGameTemplate<VerdaderoPatronContent, number> {
  readonly templateType = 'VerdaderoPatron';
  validate(c: VerdaderoPatronContent): void {
    if (c.sequence.length < 3) throw new Error('VerdaderoPatron: sequence debe tener >=3 elementos');
  }
  checkAnswer(c: VerdaderoPatronContent, _qi: number, answer: number): boolean {
    return c.nextNumber === answer;
  }
  getScore(s: GameSessionState): number { return 200; }
}
