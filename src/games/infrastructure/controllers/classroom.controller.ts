import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/jwt/jwt-auth.guard';
import { CreateClassroomUseCase } from '../../application/use-cases/create-classroom.use-case';
import { ListClassroomsUseCase } from '../../application/use-cases/list-classrooms.use-case';
import { CreateClassroomRequestDto } from '../dtos/game.dto';

@Controller('classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomController {
  constructor(
    private readonly createClassroomUseCase: CreateClassroomUseCase,
    private readonly listClassroomsUseCase: ListClassroomsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateClassroomRequestDto, @Req() req: any) {
    try {
      return await this.createClassroomUseCase.execute(req.user.sub, dto.name);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al crear salón',
      );
    }
  }

  @Get()
  async list(@Req() req: any) {
    return this.listClassroomsUseCase.execute(req.user.sub);
  }
}
