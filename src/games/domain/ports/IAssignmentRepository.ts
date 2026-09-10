import { Assignment } from '../entities/assignment.entity';

export const IAssignmentRepository = Symbol('IAssignmentRepository');

export interface IAssignmentRepository {
  create(gameId: string, classroomId: string): Promise<Assignment>;
  findByClassroomId(classroomId: string): Promise<Assignment[]>;
  findById(id: string): Promise<Assignment | null>;
}
