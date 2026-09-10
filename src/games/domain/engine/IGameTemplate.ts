/**
 * IGameTemplate — Puerto de dominio para las plantillas de juego.
 * Cada plantilla implementa esta interfaz.
 * ADR-02: Solo contenido + reglas, sin propiedades de presentación.
 * ADR-06: validate/checkAnswer/getScore son agnósticos del proveedor IA.
 */
export interface IGameTemplate<TContent = unknown, TAnswer = unknown> {
  /** Tipo único de plantilla (ej: 'SiONo', 'RelacionarColumnas') */
  readonly templateType: string;

  /**
   * Valida que el contenido sea estructuralmente correcto.
   * @throws Error si el contenido no es válido para esta plantilla.
   */
  validate(content: TContent): void;

  /**
   * Evalúa si la respuesta es correcta para la pregunta en questionIndex.
   * @returns true si la respuesta es correcta.
   */
  checkAnswer(content: TContent, questionIndex: number, answer: TAnswer): boolean;

  /**
   * Calcula la puntuación basada en el estado de la sesión.
   * @param state Estado actual (respuestas, tiempo, vidas, racha)
   * @returns Puntos obtenidos.
   */
  getScore(state: GameSessionState): number;

  /**
   * Crea el contenido inicial para una sesión (útil para plantillas generadas).
   * Opcional: por defecto devuelve el mismo contenido.
   */
  createSessionContent?(content: TContent): TContent;
}

/** Estado de una sesión de juego */
export interface GameSessionState {
  answers: AnswerRecord[];
  elapsedMs: number;
  livesLeft: number;
  streak: number;
  gameId: string;
  studentId: string;
}

export interface AnswerRecord {
  questionIndex: number;
  answer: unknown;
  isCorrect: boolean;
  elapsedMs: number;
  timestamp: Date;
}
