/**
 * IAIContentGenerator — Puerto para generación de contenido con IA (ADR-06).
 * Definido en el dominio desde P2. Implementación concreta en P6.
 */
export const IAIContentGenerator = Symbol('IAIContentGenerator');

export interface AIGenerationRequest {
  templateType: string;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
  questionCount?: number;
}

export interface IAIContentGenerator {
  /**
   * Genera contenido para una plantilla basado en un tema.
   * @returns Contenido válido para la plantilla solicitada.
   */
  generate(request: AIGenerationRequest): Promise<unknown>;
}

/**
 * Implementación mínima (determinística) para desarrollo y tests.
 * En P6 se reemplaza por la implementación real con OpenAI/Anthropic.
 */
export class MinimalContentGenerator implements IAIContentGenerator {
  async generate(request: AIGenerationRequest): Promise<unknown> {
    switch (request.templateType) {
      case 'SiONo':
        return this.generateSiONo(request);
      case 'RelacionarColumnas':
        return this.generateRelacionarColumnas(request);
      case 'SopaDeLetras':
        return this.generateSopaDeLetras(request);
      case 'OpcionMultiple':
        return this.generateOpcionMultiple(request);
      case 'MultiSeleccion':
        return this.generateMultiSeleccion(request);
      case 'VFJustificacion':
        return this.generateVFJustificacion(request);
      case 'OrdenarSecuencia':
        return this.generateOrdenarSecuencia(request);
      case 'ClasificarCategorias':
        return this.generateClasificarCategorias(request);
      case 'QuizCronometrado':
        return this.generateQuizCronometrado(request);
      default:
        throw new Error(`No hay generador mínimo para: ${request.templateType}`);
    }
  }

  private generateSiONo(request: AIGenerationRequest): unknown {
    const count = request.questionCount || 5;
    const questions: { prompt: string; answer: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        prompt: `Pregunta ${i + 1} sobre ${request.topic} (${request.level})`,
        answer: i % 2 === 0,
      });
    }
    return { questions };
  }

  private generateRelacionarColumnas(request: AIGenerationRequest): unknown {
    const count = request.questionCount || 4;
    const pairs: { left: string; right: string }[] = [];
    for (let i = 0; i < count; i++) {
      pairs.push({
        left: `${request.topic} - izquierda ${i + 1}`,
        right: `${request.topic} - derecha ${i + 1}`,
      });
    }
    return { pairs };
  }

  private generateSopaDeLetras(request: AIGenerationRequest): unknown {
    const words = [
      `${request.topic}`,
      'aprender',
      'jugar',
      'educar',
      'crear',
    ];
    return {
      words,
      gridSize: 10,
      topic: request.topic,
    };
  }

  private generateOpcionMultiple(request: AIGenerationRequest): unknown {
    const count = request.questionCount || 5;
    const questions: { prompt: string; options: string[]; correctIndex: number }[] = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        prompt: `¿Cuál es la respuesta ${i + 1} sobre ${request.topic}?`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctIndex: 0,
      });
    }
    return { questions };
  }

  private generateMultiSeleccion(request: AIGenerationRequest): unknown {
    const questions = [
      {
        prompt: `Selecciona todas las opciones correctas sobre ${request.topic}`,
        options: [
          { text: 'Opción 1', correct: true },
          { text: 'Opción 2', correct: false },
          { text: 'Opción 3', correct: true },
          { text: 'Opción 4', correct: false },
        ],
      },
    ];
    return { questions };
  }

  private generateVFJustificacion(request: AIGenerationRequest): unknown {
    return {
      questions: [
        { prompt: `${request.topic} es importante para aprender`, answer: true, justification: '' },
        { prompt: 'Todo sobre el tema ya se sabe', answer: false, justification: '' },
      ],
    };
  }

  private generateOrdenarSecuencia(request: AIGenerationRequest): unknown {
    return {
      items: [
        { id: '1', text: 'Primer paso', correctOrder: 1 },
        { id: '2', text: 'Segundo paso', correctOrder: 2 },
        { id: '3', text: 'Tercer paso', correctOrder: 3 },
      ],
    };
  }

  private generateClasificarCategorias(request: AIGenerationRequest): unknown {
    return {
      categories: ['Categoría A', 'Categoría B'],
      items: [
        { id: '1', text: 'Elemento 1', category: 'Categoría A' },
        { id: '2', text: 'Elemento 2', category: 'Categoría B' },
        { id: '3', text: 'Elemento 3', category: 'Categoría A' },
      ],
    };
  }

  private generateQuizCronometrado(request: AIGenerationRequest): unknown {
    const count = request.questionCount || 5;
    const rounds: { prompt: string; options: string[]; correctIndex: number }[] = [];
    for (let i = 0; i < count; i++) {
      rounds.push({
        prompt: `Pregunta rápida ${i + 1} sobre ${request.topic}`,
        options: ['Respuesta A', 'Respuesta B', 'Respuesta C', 'Respuesta D'],
        correctIndex: 0,
      });
    }
    return { rounds };
  }
}
