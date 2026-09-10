import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, LoginOutput, RefreshOutput } from './auth.service';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { IRefreshTokenRepository } from '../../domain/ports/IRefreshTokenRepository';
import { IJwtProvider } from '../../infrastructure/jwt/IJwtProvider';
import { User, UserRole } from '../../domain/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = new User(
    'uuid-1',
    'student@upa.com',
    'hashed-password',
    UserRole.STUDENT,
    'Test Student',
    new Date(),
  );

  const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtProvider = {
    sign: jest.fn().mockResolvedValue('mock-access-token'),
    verify: jest.fn(),
  };

  const mockRefreshRepo = {
    save: jest.fn(),
    findValid: jest.fn(),
    revoke: jest.fn(),
    revokeAllForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: IUserRepository, useValue: mockUserRepo },
        { provide: IJwtProvider, useValue: mockJwtProvider },
        { provide: IRefreshTokenRepository, useValue: mockRefreshRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('refresh', () => {
    it('should throw when token is invalid', async () => {
      mockRefreshRepo.findValid.mockResolvedValue(null);
      await expect(service.refresh('invalid-token'))
        .rejects.toThrow('Refresh token inválido o expirado');
    });

    it('should return new tokens on valid refresh', async () => {
      mockRefreshRepo.findValid.mockResolvedValue({
        id: 'token-id',
        userId: 'uuid-1',
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockUserRepo.findById.mockResolvedValue(mockUser);

      const result = await service.refresh('valid-refresh-token');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockRefreshRepo.revoke).toHaveBeenCalled();
      expect(mockRefreshRepo.save).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should revoke the refresh token', async () => {
      await service.logout('some-token');
      expect(mockRefreshRepo.revoke).toHaveBeenCalled();
    });
  });
});
