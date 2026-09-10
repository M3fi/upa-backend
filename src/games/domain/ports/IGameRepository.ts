import { Game } from '../entities/game.entity';

export const IGameRepository = Symbol('IGameRepository');

export interface CreateGameInput {
  teacherId: string;
  templateType: string;
  title: string;
  content: unknown;
  rules?: { basePoints?: number; timeLimitSec?: number; lives?: number };
}

export interface IGameRepository {
  create(input: CreateGameInput): Promise<Game>;
  findById(id: string): Promise<Game | null>;
  findByTeacherId(teacherId: string): Promise<Game[]>;
}
