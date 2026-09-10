import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface ClasificarCategoriasContent {
  categories: string[];
  items: { id: string; text: string; category: string }[];
}

export class ClasificarCategoriasTemplate implements IGameTemplate<ClasificarCategoriasContent, Record<string, string[]>> {
  readonly templateType = 'ClasificarCategorias';
  validate(content: ClasificarCategoriasContent): void {
    if (!content.categories?.length || !content.items?.length) throw new Error('ClasificarCategorias: categorias e items requeridos');
  }
  checkAnswer(content: ClasificarCategoriasContent, _qi: number, answer: Record<string, string[]>): boolean {
    const correct: Record<string, string[]> = {};
    for (const item of content.items) {
      (correct[item.category] = correct[item.category] || []).push(item.id);
    }
    return JSON.stringify(answer) === JSON.stringify(correct);
  }
  getScore(state: GameSessionState): number {
    return 250;
  }
}
