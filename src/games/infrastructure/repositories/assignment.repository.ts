import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { IAssignmentRepository } from '../../domain/ports/IAssignmentRepository';
import { Assignment } from '../../domain/entities/assignment.entity';
import { AssignmentOrmEntity } from './assignment.orm-entity';

@Injectable()
export class AssignmentRepository implements IAssignmentRepository {
  constructor(
    @InjectRepository(AssignmentOrmEntity)
    private readonly repo: Repository<AssignmentOrmEntity>,
  ) {}

  async create(gameId: string, classroomId: string): Promise<Assignment> {
    const orm = this.repo.create({
      id: randomUUID(),
      gameId,
      classroomId,
      dueAt: null,
    });
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findByClassroomId(classroomId: string): Promise<Assignment[]> {
    const orms = await this.repo.find({ where: { classroomId } });
    return orms.map(this.toDomain);
  }

  async findById(id: string): Promise<Assignment | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: AssignmentOrmEntity): Assignment {
    return new Assignment(
      orm.id,
      orm.gameId,
      orm.classroomId,
      orm.assignedAt,
      orm.dueAt,
    );
  }
}
