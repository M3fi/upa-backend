import { IGameTemplate, GameSessionState } from '../engine/IGameTemplate';

export interface RelacionarColumnasContent {
  pairs: { left: string; right: string }[];
}

export interface RelacionarColumnasAnswer {
  /** Mapeo de índice left → índice right */
  mappings: Record<number, number>;
}

export class RelacionarColumnasTemplate implements IGameTemplate<RelacionarColumnasContent, RelacionarColumnasAnswer> {
  readonly templateType = 'RelacionarColumnas';

  validate(content: RelacionarColumnasContent): void {
    if (!content.pairs || !Array.isArray(content.pairs)) {
      throw new Error('RelacionarColumnas: content.pairs debe ser un array');
    }
    if (content.pairs.length < 2) {
      throw new Error('RelacionarColumnas: debe tener al menos 2 pares');
    }
    for (let i = 0; i < content.pairs.length; i++) {
      const p = content.pairs[i];
      if (!p.left || typeof p.left !== 'string' || p.left.trim() === '') {
        throw new Error(`RelacionarColumnas: pair[${i}].left inválido`);
      }
      if (!p.right || typeof p.right !== 'string' || p.right.trim() === '') {
        throw new Error(`RelacionarColumnas: pair[${i}].right inválido`);
      }
    }
  }

  checkAnswer(content: RelacionarColumnasContent, questionIndex: number, answer: RelacionarColumnasAnswer): boolean {
    // questionIndex is ignored for RelacionarColumnas (one-shot matching)
    const correct: Record<number, number> = {};
    for (let i = 0; i < content.pairs.length; i++) {
      correct[i] = i; // Each left maps to its pair index
    }
    return JSON.stringify(answer.mappings) === JSON.stringify(correct);
  }

  getScore(state: GameSessionState): number {
    const basePoints = 200; // More complex than SiONo
    const speedBonus = state.elapsedMs < 30000 ? 1.5 : state.elapsedMs < 60000 ? 1.2 : 1.0;
    return Math.round(basePoints * speedBonus);
  }
}
