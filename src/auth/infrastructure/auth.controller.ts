import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../application/use-cases/auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { Roles } from './jwt/roles.decorator';
import { RolesGuard } from './jwt/roles.guard';
import { UserRole } from '../domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: { email: string; password: string }) {
    try {
      return await this.authService.login(dto.email, dto.password);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Credenciales inválidas',
      );
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: { email: string; password: string; displayName: string; role: string }) {
    return this.authService.register(dto.email, dto.password, dto.displayName, dto.role);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: { refreshToken: string }) {
    try {
      return await this.authService.refresh(dto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Refresh token inválido',
      );
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Body() dto: { refreshToken: string }) {
    await this.authService.logout(dto.refreshToken);
    return { message: 'Sesión cerrada' };
  }
}
