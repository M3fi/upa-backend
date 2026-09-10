import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface OperacionesMatematicasContent { questions: { expression: string; correctAnswer: number }[]; }
export class OperacionesMatematicasTemplate implements IGameTemplate<OperacionesMatematicasContent, number> {
  readonly templateType = 'OperacionesMatematicas';
  validate(c: OperacionesMatematicasContent): void {
    if (!c.questions?.length) throw new Error('OperacionesMatematicas: questions requerido');
  }
  checkAnswer(c: OperacionesMatematicasContent, qi: number, answer: number): boolean {
    return c.questions[qi]?.correctAnswer === answer;
  }
  getScore(s: GameSessionState): number { return 100 * (s.streak + 1); }
}
