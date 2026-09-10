import { Injectable, Inject } from '@nestjs/common';
import { IClassroomRepository } from '../../domain/ports/IClassroomRepository';

@Injectable()
export class CreateClassroomUseCase {
  constructor(
    @Inject(IClassroomRepository) private readonly classroomRepo: IClassroomRepository,
  ) {}

  async execute(teacherId: string, name: string): Promise<{ id: string; name: string; code: string }> {
    const code = this.generateCode(name);
    const classroom = await this.classroomRepo.create({ teacherId, name, code });
    return { id: classroom.id, name: classroom.name, code: classroom.code };
  }

  private generateCode(name: string): string {
    const prefix = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)
      .padEnd(4, 'X');
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${suffix}`;
  }
}
