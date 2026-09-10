import { IGameTemplate } from './IGameTemplate';

/**
 * GameFactory — Resuelve plantillas por templateType mediante registro.
 * Open/Closed: agregar una plantilla = registrar, no modificar el factory.
 */
export class GameFactory {
  private static readonly templates = new Map<string, IGameTemplate>();

  /** Registra una plantilla en el factory */
  static register(template: IGameTemplate): void {
    const key = template.templateType;
    if (GameFactory.templates.has(key)) {
      throw new Error(`Template '${key}' ya está registrada`);
    }
    GameFactory.templates.set(key, template);
  }

  /** Obtiene una plantilla por tipo */
  static get(templateType: string): IGameTemplate {
    const template = GameFactory.templates.get(templateType);
    if (!template) {
      throw new Error(`Template '${templateType}' no está registrada`);
    }
    return template;
  }

  /** Lista todas las plantillas registradas */
  static list(): string[] {
    return Array.from(GameFactory.templates.keys());
  }

  /** Limpia todas las plantillas (útil para tests) */
  static reset(): void {
    GameFactory.templates.clear();
  }
}
