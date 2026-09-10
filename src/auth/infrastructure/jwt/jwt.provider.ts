import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtProvider,
  JwtPayload,
} from './IJwtProvider';

@Injectable()
export class JwtProvider implements IJwtProvider {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync({ ...payload });
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
