import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { IPlayerScoreRepository } from '../../domain/ports/IPlayerScoreRepository';
import { PlayerScore } from '../../domain/entities/player-score.entity';
import { PlayerScoreOrmEntity } from './player-score.orm-entity';

@Injectable()
export class PlayerScoreRepository implements IPlayerScoreRepository {
  constructor(
    @InjectRepository(PlayerScoreOrmEntity)
    private readonly repo: Repository<PlayerScoreOrmEntity>,
  ) {}

  async save(score: PlayerScore): Promise<PlayerScore> {
    const orm = this.repo.create({
      id: score.id || randomUUID(),
      studentId: score.studentId,
      assignmentId: score.assignmentId,
      score: score.score,
    });
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findByStudentIdAndAssignmentId(studentId: string, assignmentId: string): Promise<PlayerScore | null> {
    const orm = await this.repo.findOne({
      where: { studentId, assignmentId },
      relations: ['assignment'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByAssignmentId(assignmentId: string): Promise<PlayerScore[]> {
    const orms = await this.repo.find({
      where: { assignmentId },
      relations: ['assignment'],
      order: { score: 'DESC' },
    });
    return orms.map(this.toDomain);
  }

  async findByGameId(gameId: string): Promise<PlayerScore[]> {
    const orms = await this.repo
      .createQueryBuilder('ps')
      .innerJoin('ps.assignment', 'a')
      .where('a.game_id = :gameId', { gameId })
      .orderBy('ps.score', 'DESC')
      .getMany();
    return orms.map(this.toDomain);
  }

  async findByStudentId(studentId: string): Promise<PlayerScore[]> {
    const orms = await this.repo.find({
      where: { studentId },
      relations: ['assignment'],
    });
    return orms.map(this.toDomain);
  }

  private toDomain(orm: PlayerScoreOrmEntity): PlayerScore {
    return new PlayerScore(
      orm.id,
      orm.studentId,
      orm.assignmentId,
      orm.score,
      orm.completedAt,
      orm.assignment?.gameId,
    );
  }
}
