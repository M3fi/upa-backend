import { Injectable, Inject } from '@nestjs/common';
import { IClassroomRepository } from '../../domain/ports/IClassroomRepository';

export interface ListClassroomsOutput {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
}

@Injectable()
export class ListClassroomsUseCase {
  constructor(
    @Inject(IClassroomRepository) private readonly classroomRepo: IClassroomRepository,
  ) {}

  async execute(teacherId: string): Promise<ListClassroomsOutput[]> {
    const classrooms = await this.classroomRepo.findByTeacherId(teacherId);
    return classrooms.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      createdAt: c.createdAt,
    }));
  }
}
