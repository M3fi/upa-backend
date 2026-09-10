import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';
import { GameFactory } from '../engine/GameFactory';

export interface SequenceStep {
  templateType: string;
  title: string;
  content: unknown;
  rules?: { timeLimitSec?: number; lives?: number; basePoints?: number };
}

export interface SecuenciaContent {
  topic: string;
  steps: SequenceStep[];
}

export class SecuenciaTemplate implements IGameTemplate<SecuenciaContent, unknown> {
  readonly templateType = 'Secuencia';

  validate(c: SecuenciaContent): void {
    if (!c.topic?.trim()) throw new Error('Secuencia: tema requerido');
    if (!c.steps?.length) throw new Error('Secuencia: al menos un paso requerido');
    c.steps.forEach((step, i) => {
      if (!step.templateType) throw new Error(`Paso ${i + 1}: tipo de plantilla requerido`);
      if (!step.title?.trim()) throw new Error(`Paso ${i + 1}: título requerido`);
      try {
        const template = GameFactory.get(step.templateType);
        template.validate(step.content);
      } catch (e) {
        throw new Error(`Paso ${i + 1} (${step.templateType}): ${e instanceof Error ? e.message : 'contenido inválido'}`);
      }
    });
  }

  checkAnswer(c: SecuenciaContent, questionIndex: number, answer: unknown): boolean {
    const step = c.steps[questionIndex];
    if (!step) return false;
    try {
      const template = GameFactory.get(step.templateType);
      return template.checkAnswer(step.content, 0, answer);
    } catch {
      return false;
    }
  }

  getScore(s: GameSessionState): number {
    return s.answers.reduce((sum, a) => sum + (a.isCorrect ? 100 : 0), 0);
  }

  createSessionContent(c: SecuenciaContent): SecuenciaContent {
    // Return a copy so the render endpoint serves the full sequence
    return { ...c, steps: c.steps.map(s => ({ ...s })) };
  }
}
