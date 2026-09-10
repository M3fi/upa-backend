import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  IGameRepository,
  CreateGameInput,
} from '../../domain/ports/IGameRepository';
import { Game } from '../../domain/entities/game.entity';
import { GameOrmEntity } from './game.orm-entity';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectRepository(GameOrmEntity)
    private readonly repo: Repository<GameOrmEntity>,
  ) {}

  async create(input: CreateGameInput): Promise<Game> {
    const orm = this.repo.create({
      id: randomUUID(),
      teacherId: input.teacherId,
      templateType: input.templateType,
      title: input.title,
      content: input.content as unknown as Record<string, unknown>,
      rules: (input.rules || { basePoints: 100 }) as unknown as Record<string, unknown>,
    });
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Game | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByTeacherId(teacherId: string): Promise<Game[]> {
    const orms = await this.repo.find({ where: { teacherId } });
    return orms.map(this.toDomain);
  }

  private toDomain(orm: GameOrmEntity): Game {
    return new Game(
      orm.id,
      orm.teacherId,
      orm.templateType,
      orm.title,
      orm.content,
      orm.rules as { timeLimitSec?: number; lives?: number; basePoints?: number },
      orm.createdAt,
    );
  }
}
