import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface RompecabezasContent { pieces: { id: string; correctPosition: number }[]; }
export class RompecabezasTemplate implements IGameTemplate<RompecabezasContent, Record<string, number>> {
  readonly templateType = 'Rompecabezas';
  validate(c: RompecabezasContent): void {
    if (!c.pieces?.length) throw new Error('Rompecabezas: pieces requerido');
  }
  checkAnswer(c: RompecabezasContent, _qi: number, answer: Record<string, number>): boolean {
    return c.pieces.every(p => answer[p.id] === p.correctPosition);
  }
  getScore(s: GameSessionState): number { return 300; }
}
