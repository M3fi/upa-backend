import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './application/use-cases/auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserOrmEntity } from './infrastructure/repositories/user.orm-entity';
import { RefreshTokenOrmEntity } from './infrastructure/repositories/refresh-token.orm-entity';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.repository';
import { UserSeedService } from './infrastructure/repositories/user-seed.service';
import { IUserRepository } from './domain/ports/IUserRepository';
import { IRefreshTokenRepository } from './domain/ports/IRefreshTokenRepository';
import { IJwtProvider } from './infrastructure/jwt/IJwtProvider';
import { JwtProvider } from './infrastructure/jwt/jwt.provider';
import { JwtAuthGuard } from './infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from './infrastructure/jwt/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, RefreshTokenOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret-do-not-use-in-prod'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    UserSeedService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IRefreshTokenRepository,
      useClass: RefreshTokenRepository,
    },
    {
      provide: IJwtProvider,
      useClass: JwtProvider,
    },
  ],
  exports: [JwtAuthGuard, RolesGuard, IJwtProvider, IUserRepository, JwtModule],
})
export class AuthModule {}
