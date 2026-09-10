import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/jwt/jwt-auth.guard';
import { CreateGameUseCase } from '../../application/use-cases/create-game.use-case';
import { ListGamesUseCase } from '../../application/use-cases/list-games.use-case';
import { AssignGameUseCase } from '../../application/use-cases/assign-game.use-case';
import { ListAssignmentsUseCase } from '../../application/use-cases/list-assignments.use-case';
import { GetGameRenderDataUseCase } from '../../application/use-cases/get-game-render-data.use-case';
import { SubmitAnswerUseCase } from '../../application/use-cases/submit-answer.use-case';
import { GetMyScoresUseCase } from '../../application/use-cases/get-my-scores.use-case';
import {
  CreateGameRequestDto,
  AssignGameRequestDto,
  SubmitAnswerRequestDto,
} from '../dtos/game.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(
    private readonly createGameUseCase: CreateGameUseCase,
    private readonly listGamesUseCase: ListGamesUseCase,
    private readonly assignGameUseCase: AssignGameUseCase,
    private readonly listAssignmentsUseCase: ListAssignmentsUseCase,
    private readonly getGameRenderDataUseCase: GetGameRenderDataUseCase,
    private readonly submitAnswerUseCase: SubmitAnswerUseCase,
    private readonly getMyScoresUseCase: GetMyScoresUseCase,
  ) {}

  @Post('games')
  async createGame(@Body() dto: CreateGameRequestDto, @Req() req: any) {
    return this.createGameUseCase.execute({
      teacherId: req.user.sub,
      templateType: dto.templateType,
      title: dto.title,
      content: dto.content,
      rules: dto.rules,
    });
  }

  @Get('games')
  async listGames(@Req() req: any) {
    return this.listGamesUseCase.execute(req.user.sub);
  }

  @Post('games/:gameId/assign')
  async assignGame(
    @Param('gameId') gameId: string,
    @Body() dto: AssignGameRequestDto,
    @Req() req: any,
  ) {
    try {
      return await this.assignGameUseCase.execute(
        gameId,
        dto.classroomId,
        req.user.sub,
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Juego no encontrado') {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException(
        error instanceof Error ? error.message : 'Acceso denegado',
      );
    }
  }

  @Get('assignments')
  async listAssignments(@Req() req: any) {
    return this.listAssignmentsUseCase.execute(req.user.sub);
  }

  @Get('games/:gameId/render')
  async getGameRenderData(@Param('gameId') gameId: string) {
    try {
      return await this.getGameRenderDataUseCase.execute(gameId);
    } catch (error) {
      throw new NotFoundException(
        error instanceof Error ? error.message : 'Juego no encontrado',
      );
    }
  }

  @Get('scores/me')
  async getMyScores(@Req() req: any) {
    try {
      return await this.getMyScoresUseCase.execute(req.user.sub);
    } catch (error) {
      throw new BadRequestException('Error al obtener puntuaciones');
    }
  }

  @Post('sessions/:gameId/answer')
  @HttpCode(HttpStatus.OK)
  async submitAnswer(
    @Param('gameId') gameId: string,
    @Body() dto: SubmitAnswerRequestDto,
    @Req() req: any,
  ) {
    try {
      return await this.submitAnswerUseCase.execute({
        studentId: req.user.sub,
        gameId,
        questionIndex: dto.questionIndex,
        answer: dto.answer,
        elapsedMs: dto.elapsedMs,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al enviar respuesta',
      );
    }
  }
}
