import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface RespuestaCortaContent { questions: { prompt: string; acceptedAnswers: string[] }[]; }
export class RespuestaCortaTemplate implements IGameTemplate<RespuestaCortaContent, string> {
  readonly templateType = 'RespuestaCorta';
  validate(c: RespuestaCortaContent): void {
    if (!c.questions?.length) throw new Error('RespuestaCorta: questions requerido');
  }
  checkAnswer(c: RespuestaCortaContent, qi: number, answer: string): boolean {
    return c.questions[qi]?.acceptedAnswers.some(a => a.toLowerCase().trim() === answer.toLowerCase().trim()) ?? false;
  }
  getScore(s: GameSessionState): number { return 150; }
}
