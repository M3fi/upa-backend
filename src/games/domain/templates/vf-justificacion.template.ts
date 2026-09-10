import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface VFJustificacionContent {
  questions: { prompt: string; answer: boolean; justification: string }[];
}

export class VFJustificacionTemplate implements IGameTemplate<VFJustificacionContent, { answer: boolean; justification: string }> {
  readonly templateType = 'VFJustificacion';
  validate(content: VFJustificacionContent): void {
    if (!content.questions?.length) throw new Error('VFJustificacion: questions requerido');
  }
  checkAnswer(content: VFJustificacionContent, qi: number, answer: { answer: boolean; justification: string }): boolean {
    return content.questions[qi]?.answer === answer.answer && answer.justification.trim().length > 0;
  }
  getScore(state: GameSessionState): number {
    return 120;
  }
}
