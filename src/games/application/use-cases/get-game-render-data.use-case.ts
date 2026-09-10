import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGameRepository } from '../../domain/ports/IGameRepository';

@Injectable()
export class GetGameRenderDataUseCase {
  constructor(
    @Inject(IGameRepository) private readonly gameRepo: IGameRepository,
  ) {}

  async execute(gameId: string) {
    const game = await this.gameRepo.findById(gameId);
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }

    return {
      gameId: game.id,
      templateType: game.templateType,
      content: game.content,
      rules: game.rules,
    };
  }
}
