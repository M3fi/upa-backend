import { UserRole } from '../../domain/entities/user.entity';

export const IJwtProvider = Symbol('IJwtProvider');

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface IJwtProvider {
  sign(payload: JwtPayload): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
}
