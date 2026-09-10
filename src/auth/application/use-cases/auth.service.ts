import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { IJwtProvider } from '../../infrastructure/jwt/IJwtProvider';
import { IRefreshTokenRepository } from '../../domain/ports/IRefreshTokenRepository';
import { hashToken } from '../../infrastructure/repositories/refresh-token.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface RefreshOutput {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserRepository) private readonly userRepo: IUserRepository,
    @Inject(IJwtProvider) private readonly jwtProvider: IJwtProvider,
    @Inject(IRefreshTokenRepository) private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async login(email: string, password: string): Promise<LoginOutput> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const bcrypt = require('bcrypt');
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepo.save(user.id, tokenHash, expiresAt);

    return { accessToken, refreshToken, role: user.role.toString() };
  }

  async register(
    email: string,
    password: string,
    displayName: string,
    role: string,
  ): Promise<LoginOutput> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const validRoles: Record<string, UserRole> = {
      TEACHER: UserRole.TEACHER,
      STUDENT: UserRole.STUDENT,
    };
    const userRole = validRoles[role.toUpperCase()];
    if (!userRole) {
      throw new UnauthorizedException('Rol inválido. Use TEACHER o STUDENT');
    }

    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User(
      randomUUID(),
      email.toLowerCase().trim(),
      passwordHash,
      userRole,
      displayName.trim(),
      new Date(),
    );
    await this.userRepo.save(user);

    const accessToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepo.save(user.id, tokenHash, expiresAt);

    return { accessToken, refreshToken, role: user.role.toString() };
  }

  async refresh(refreshToken: string): Promise<RefreshOutput> {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshTokenRepo.findValid(tokenHash);
    if (!stored) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    await this.refreshTokenRepo.revoke(tokenHash);

    const user = await this.userRepo.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const newAccessToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = crypto.randomBytes(48).toString('hex');
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepo.save(user.id, newHash, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.refreshTokenRepo.revoke(tokenHash);
  }
}
