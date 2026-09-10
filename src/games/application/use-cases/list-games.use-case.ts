import { Injectable, Inject } from '@nestjs/common';
import { IGameRepository } from '../../domain/ports/IGameRepository';
import { Game } from '../../domain/entities/game.entity';

export interface ListGamesOutput {
  id: string;
  templateType: string;
  title: string;
  createdAt: Date;
}

@Injectable()
export class ListGamesUseCase {
  constructor(
    @Inject(IGameRepository) private readonly gameRepo: IGameRepository,
  ) {}

  async execute(teacherId: string): Promise<ListGamesOutput[]> {
    const games = await this.gameRepo.findByTeacherId(teacherId);
    return games.map((g: Game) => ({
      id: g.id,
      templateType: g.templateType,
      title: g.title,
      createdAt: g.createdAt,
    }));
  }
}
