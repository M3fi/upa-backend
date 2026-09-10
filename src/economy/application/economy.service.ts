import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  domainEventBus,
  ScoreUpdatedEvent,
  RewardGrantedEvent,
} from '../../games/domain/events/domain-events';
import { WalletOrmEntity } from '../../games/infrastructure/repositories/wallet.orm-entity';

@Injectable()
export class EconomyService {
  private readonly logger = new Logger(EconomyService.name);

  constructor(
    @InjectRepository(WalletOrmEntity)
    private readonly walletRepo: Repository<WalletOrmEntity>,
  ) {
    domainEventBus.subscribe('ScoreUpdated', async (event) => {
      if (event instanceof ScoreUpdatedEvent) {
        await this.handleScoreUpdated(event);
      }
    });
  }

  async getBalance(studentId: string): Promise<number> {
    const wallet = await this.walletRepo.findOne({ where: { studentId } });
    return wallet?.coins ?? 0;
  }

  private async handleScoreUpdated(event: ScoreUpdatedEvent): Promise<void> {
    const coinsEarned = Math.floor(event.delta / 10);
    if (coinsEarned <= 0) return;

    const wallet = await this.walletRepo.findOne({ where: { studentId: event.studentId } });
    const currentCoins = wallet?.coins ?? 0;

    await this.walletRepo.upsert(
      { studentId: event.studentId, coins: currentCoins + coinsEarned },
      { conflictPaths: ['studentId'] as any, skipUpdateIfNoValuesChanged: false },
    );

    const rewardEvent = new RewardGrantedEvent(
      event.gameId,
      event.studentId,
      'coins',
      coinsEarned,
    );
    await domainEventBus.publish(rewardEvent);

    this.logger.debug(`Coins credited: student=${event.studentId} +${coinsEarned} coins`);
  }
}
