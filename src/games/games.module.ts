import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './infrastructure/controllers/game.controller';
import { ClassroomController } from './infrastructure/controllers/classroom.controller';
import { CreateGameUseCase } from './application/use-cases/create-game.use-case';
import { ListGamesUseCase } from './application/use-cases/list-games.use-case';
import { AssignGameUseCase } from './application/use-cases/assign-game.use-case';
import { ListAssignmentsUseCase } from './application/use-cases/list-assignments.use-case';
import { GetGameRenderDataUseCase } from './application/use-cases/get-game-render-data.use-case';
import { GetMyScoresUseCase } from './application/use-cases/get-my-scores.use-case';
import { SubmitAnswerUseCase } from './application/use-cases/submit-answer.use-case';
import { CreateClassroomUseCase } from './application/use-cases/create-classroom.use-case';
import { ListClassroomsUseCase } from './application/use-cases/list-classrooms.use-case';
import { GameRepository } from './infrastructure/repositories/game.repository';
import { AssignmentRepository } from './infrastructure/repositories/assignment.repository';
import { PlayerScoreRepository } from './infrastructure/repositories/player-score.repository';
import { ClassroomRepository } from './infrastructure/repositories/classroom.repository';
import { GameOrmEntity } from './infrastructure/repositories/game.orm-entity';
import { AssignmentOrmEntity } from './infrastructure/repositories/assignment.orm-entity';
import { PlayerScoreOrmEntity } from './infrastructure/repositories/player-score.orm-entity';
import { ClassroomOrmEntity } from './infrastructure/repositories/classroom.orm-entity';
import { ClassroomStudentOrmEntity } from './infrastructure/repositories/classroom-student.orm-entity';
import { IGameRepository } from './domain/ports/IGameRepository';
import { IAssignmentRepository } from './domain/ports/IAssignmentRepository';
import { IPlayerScoreRepository } from './domain/ports/IPlayerScoreRepository';
import { IClassroomRepository } from './domain/ports/IClassroomRepository';
import { GameSessionService } from './infrastructure/engine/game-session.service';
import { TemplateRegistryService } from './infrastructure/engine/template-registry.service';
import { IAIContentGenerator, MinimalContentGenerator } from './domain/engine/IAIContentGenerator';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameOrmEntity,
      AssignmentOrmEntity,
      PlayerScoreOrmEntity,
      ClassroomOrmEntity,
      ClassroomStudentOrmEntity,
    ]),
    forwardRef(() => LeaderboardModule),
    AuthModule,
  ],
  controllers: [GameController, ClassroomController],
  providers: [
    CreateGameUseCase,
    ListGamesUseCase,
    AssignGameUseCase,
    ListAssignmentsUseCase,
    GetGameRenderDataUseCase,
    SubmitAnswerUseCase,
    CreateClassroomUseCase,
    ListClassroomsUseCase,
    GetMyScoresUseCase,
    GameSessionService,
    TemplateRegistryService,
    {
      provide: IAIContentGenerator,
      useClass: MinimalContentGenerator,
    },
    { provide: IGameRepository, useClass: GameRepository },
    { provide: IAssignmentRepository, useClass: AssignmentRepository },
    { provide: IPlayerScoreRepository, useClass: PlayerScoreRepository },
    { provide: IClassroomRepository, useClass: ClassroomRepository },
  ],
  exports: [GameSessionService],
})
export class GamesModule {}
