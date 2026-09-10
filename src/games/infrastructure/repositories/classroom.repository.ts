import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  IClassroomRepository,
  CreateClassroomInput,
} from '../../domain/ports/IClassroomRepository';
import { Classroom } from '../../domain/entities/classroom.entity';
import { ClassroomOrmEntity } from './classroom.orm-entity';

@Injectable()
export class ClassroomRepository implements IClassroomRepository {
  constructor(
    @InjectRepository(ClassroomOrmEntity)
    private readonly repo: Repository<ClassroomOrmEntity>,
  ) {}

  async create(input: CreateClassroomInput): Promise<Classroom> {
    const orm = this.repo.create({
      id: randomUUID(),
      teacherId: input.teacherId,
      name: input.name,
      code: input.code,
    });
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findByTeacherId(teacherId: string): Promise<Classroom[]> {
    const orms = await this.repo.find({ where: { teacherId } });
    return orms.map(this.toDomain);
  }

  async findById(id: string): Promise<Classroom | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: ClassroomOrmEntity): Classroom {
    return new Classroom(
      orm.id,
      orm.teacherId,
      orm.name,
      orm.code,
      orm.createdAt,
    );
  }
}
