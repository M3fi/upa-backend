import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface CrucigramaContent { grid: string[][]; clues: { x: number; y: number; direction: 'across'|'down'; answer: string }[]; }
export class CrucigramaTemplate implements IGameTemplate<CrucigramaContent, Record<string, string>> {
  readonly templateType = 'Crucigrama';
  validate(c: CrucigramaContent): void {
    if (!c.grid?.length || !c.clues?.length) throw new Error('Crucigrama: grid y clues requeridos');
  }
  checkAnswer(c: CrucigramaContent, _qi: number, answer: Record<string, string>): boolean {
    return c.clues.every(clue => (answer[`${clue.x},${clue.y}`] || '').toUpperCase() === clue.answer.toUpperCase());
  }
  getScore(s: GameSessionState): number { return 300; }
}
