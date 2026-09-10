export type TemplateType = string;

export interface GameRules {
  timeLimitSec?: number | null;
  lives?: number | null;
  basePoints?: number;
}

export class Game {
  constructor(
    public readonly id: string,
    public readonly teacherId: string,
    public readonly templateType: TemplateType,
    public readonly title: string,
    public readonly content: unknown,
    public readonly rules: GameRules,
    public readonly createdAt: Date,
  ) {}
}
