import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserOrmEntity, OrmUserRole } from './user.orm-entity';

@Injectable()
export class UserSeedService implements OnModuleInit {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.repo.count();
    if (existing > 0) {
      this.logger.log(`Seed skipped: ${existing} users already exist`);
      return;
    }

    const hash = await bcrypt.hash('password123', 10);

    await this.repo.save([
      {
        email: 'teacher@upa.com',
        passwordHash: hash,
        role: OrmUserRole.TEACHER,
        displayName: 'Profesor Upa',
      },
      {
        email: 'student@upa.com',
        passwordHash: hash,
        role: OrmUserRole.STUDENT,
        displayName: 'Estudiante Upa',
      },
    ]);

    this.logger.log('Seed complete: teacher + student users created');
  }
}
