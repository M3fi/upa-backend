import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoringService } from './application/scoring.service';
import { PlayerScoreOrmEntity } from '../games/infrastructure/repositories/player-score.orm-entity';
import { PlayerScoreRepository } from '../games/infrastructure/repositories/player-score.repository';
import { IPlayerScoreRepository } from '../games/domain/ports/IPlayerScoreRepository';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerScoreOrmEntity])],
  providers: [
    ScoringService,
    { provide: IPlayerScoreRepository, useClass: PlayerScoreRepository },
  ],
})
export class ScoringModule {}
