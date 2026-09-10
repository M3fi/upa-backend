import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { IRefreshTokenRepository } from '../../domain/ports/IRefreshTokenRepository';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {}

  async save(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    const entity = this.repo.create({
      userId,
      tokenHash,
      expiresAt,
      isRevoked: false,
    });
    await this.repo.save(entity);
  }

  async findValid(tokenHash: string): Promise<{ id: string; userId: string; expiresAt: Date } | null> {
    const token = await this.repo.findOne({
      where: { tokenHash, isRevoked: false },
    });
    if (!token) return null;
    if (token.expiresAt < new Date()) {
      await this.revoke(tokenHash);
      return null;
    }
    return { id: token.id, userId: token.userId, expiresAt: token.expiresAt };
  }

  async revoke(tokenHash: string): Promise<void> {
    await this.repo.update({ tokenHash }, { isRevoked: true });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repo.update({ userId, isRevoked: false }, { isRevoked: true });
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
