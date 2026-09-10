import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserOrmEntity, OrmUserRole } from './user.orm-entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email } });
    return orm ? this.toDomain(orm) : null;
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(user: User): Promise<User> {
    const orm = this.repo.create({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role as unknown as OrmUserRole,
      displayName: user.displayName,
      createdAt: user.createdAt,
    });
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  private toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      orm.email,
      orm.passwordHash,
      orm.role as unknown as UserRole,
      orm.displayName,
      orm.createdAt,
    );
  }
}
