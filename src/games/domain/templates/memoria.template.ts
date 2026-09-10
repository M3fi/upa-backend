import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface MemoriaContent { pairs: { id: string; content: string; matchId: string }[]; }
export class MemoriaTemplate implements IGameTemplate<MemoriaContent, Record<string, string>> {
  readonly templateType = 'Memoria';
  validate(c: MemoriaContent): void {
    if (!c.pairs?.length || c.pairs.length % 2 !== 0) throw new Error('Memoria: número par de elementos requerido');
  }
  checkAnswer(c: MemoriaContent, _qi: number, answer: Record<string, string>): boolean {
    return Object.entries(answer).every(([k, v]) => {
      const card = c.pairs.find(p => p.id === k);
      return card && card.matchId === v;
    });
  }
  getScore(s: GameSessionState): number { return 250; }
}
