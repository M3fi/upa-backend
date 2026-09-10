import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface LineaTiempoContent { events: { year: number; description: string }[]; }
export class LineaTiempoTemplate implements IGameTemplate<LineaTiempoContent, number[]> {
  readonly templateType = 'LineaTiempo';
  validate(c: LineaTiempoContent): void {
    if (!c.events?.length) throw new Error('LineaTiempo: events requerido');
  }
  checkAnswer(c: LineaTiempoContent, _qi: number, answer: number[]): boolean {
    const correct = [...c.events].sort((a, b) => a.year - b.year).map((_, i) => i);
    return JSON.stringify(answer) === JSON.stringify(correct);
  }
  getScore(s: GameSessionState): number { return 200; }
}
