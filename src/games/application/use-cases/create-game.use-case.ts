import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IGameRepository } from '../../domain/ports/IGameRepository';
import { GameFactory } from '../../domain/engine/GameFactory';

export interface CreateGameInput {
  teacherId: string;
  templateType: string;
  title: string;
  content: unknown;
  rules?: { basePoints?: number; timeLimitSec?: number; lives?: number };
}

export interface CreateGameOutput {
  id: string;
  templateType: string;
  title: string;
}

@Injectable()
export class CreateGameUseCase {
  constructor(
    @Inject(IGameRepository) private readonly gameRepo: IGameRepository,
  ) {}

  async execute(input: CreateGameInput): Promise<CreateGameOutput> {
    // Validate that the template exists and content is valid
    let template;
    try {
      template = GameFactory.get(input.templateType);
    } catch {
      throw new BadRequestException(`Plantilla '${input.templateType}' no válida`);
    }

    try {
      template.validate(input.content);
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Contenido inválido para la plantilla',
      );
    }

    const game = await this.gameRepo.create({
      teacherId: input.teacherId,
      templateType: input.templateType,
      title: input.title,
      content: input.content,
      rules: input.rules || { basePoints: 100 },
    });

    return {
      id: game.id,
      templateType: game.templateType,
      title: game.title,
    };
  }
}
