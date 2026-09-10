import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface QuizCronometradoContent { rounds: { prompt: string; options: string[]; correctIndex: number }[]; }
export class QuizCronometradoTemplate implements IGameTemplate<QuizCronometradoContent, number[]> {
  readonly templateType = 'QuizCronometrado';
  validate(c: QuizCronometradoContent): void {
    if (!c.rounds?.length) throw new Error('QuizCronometrado: rounds requerido');
  }
  checkAnswer(c: QuizCronometradoContent, _qi: number, answer: number[]): boolean {
    return c.rounds.every((r, i) => r.correctIndex === answer[i]);
  }
  getScore(s: GameSessionState): number { return 100 * (s.streak + 2); }
}
