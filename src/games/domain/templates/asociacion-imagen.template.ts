import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface AsociacionImagenContent { pairs: { imageUrl: string; concept: string }[]; }
export class AsociacionImagenTemplate implements IGameTemplate<AsociacionImagenContent, Record<string, string>> {
  readonly templateType = 'AsociacionImagen';
  validate(c: AsociacionImagenContent): void {
    if (!c.pairs?.length) throw new Error('AsociacionImagen: pairs requerido');
  }
  checkAnswer(c: AsociacionImagenContent, _qi: number, answer: Record<string, string>): boolean {
    return c.pairs.every(p => answer[p.imageUrl] === p.concept);
  }
  getScore(s: GameSessionState): number { return 200; }
}
