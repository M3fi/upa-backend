export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');

export interface IRefreshTokenRepository {
  save(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findValid(tokenHash: string): Promise<{ id: string; userId: string; expiresAt: Date } | null>;
  revoke(tokenHash: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
