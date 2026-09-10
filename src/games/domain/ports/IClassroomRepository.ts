import { Classroom } from '../entities/classroom.entity';

export const IClassroomRepository = Symbol('IClassroomRepository');

export interface CreateClassroomInput {
  teacherId: string;
  name: string;
  code: string;
}

export interface IClassroomRepository {
  create(input: CreateClassroomInput): Promise<Classroom>;
  findByTeacherId(teacherId: string): Promise<Classroom[]>;
  findById(id: string): Promise<Classroom | null>;
}
