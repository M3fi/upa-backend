import { Injectable, Inject } from '@nestjs/common';
import { IAssignmentRepository } from '../../domain/ports/IAssignmentRepository';

@Injectable()
export class ListAssignmentsUseCase {
  constructor(
    @Inject(IAssignmentRepository) private readonly assignmentRepo: IAssignmentRepository,
  ) {}

  async execute(classroomId: string) {
    return this.assignmentRepo.findByClassroomId(classroomId);
  }
}
