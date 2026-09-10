import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface OrdenarSecuenciaContent {
  items: { id: string; text: string; correctOrder: number }[];
}

export class OrdenarSecuenciaTemplate implements IGameTemplate<OrdenarSecuenciaContent, string[]> {
  readonly templateType = 'OrdenarSecuencia';
  validate(content: OrdenarSecuenciaContent): void {
    if (!content.items?.length) throw new Error('OrdenarSecuencia: items requerido');
  }
  checkAnswer(content: OrdenarSecuenciaContent, _qi: number, answer: string[]): boolean {
    const sorted = [...content.items].sort((a, b) => a.correctOrder - b.correctOrder);
    return JSON.stringify(answer) === JSON.stringify(sorted.map(i => i.id));
  }
  getScore(state: GameSessionState): number {
    return 200;
  }
}
