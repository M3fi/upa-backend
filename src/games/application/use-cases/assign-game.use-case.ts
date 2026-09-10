import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAssignmentRepository } from '../../domain/ports/IAssignmentRepository';
import { IGameRepository } from '../../domain/ports/IGameRepository';

@Injectable()
export class AssignGameUseCase {
  constructor(
    @Inject(IAssignmentRepository) private readonly assignmentRepo: IAssignmentRepository,
    @Inject(IGameRepository) private readonly gameRepo: IGameRepository,
  ) {}

  async execute(gameId: string, classroomId: string, teacherId: string) {
    const game = await this.gameRepo.findById(gameId);
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }
    if (game.teacherId !== teacherId) {
      throw new ForbiddenException('No tienes permiso para asignar este juego');
    }
    return this.assignmentRepo.create(gameId, classroomId);
  }
}
