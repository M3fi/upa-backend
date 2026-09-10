import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface OpcionMultipleContent {
  questions: { prompt: string; options: string[]; correctIndex: number }[];
}

export class OpcionMultipleTemplate implements IGameTemplate<OpcionMultipleContent, number> {
  readonly templateType = 'OpcionMultiple';
  validate(content: OpcionMultipleContent): void {
    if (!content.questions?.length) throw new Error('OpcionMultiple: questions requerido');
    for (const q of content.questions) {
      if (q.options.length < 2) throw new Error('OpcionMultiple: cada pregunta debe tener >=2 opciones');
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) throw new Error('OpcionMultiple: correctIndex fuera de rango');
    }
  }
  checkAnswer(content: OpcionMultipleContent, qi: number, answer: number): boolean {
    return content.questions[qi]?.correctIndex === answer;
  }
  getScore(state: GameSessionState): number {
    return 100 * (state.streak + 1);
  }
}
