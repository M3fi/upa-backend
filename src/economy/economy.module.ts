import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomyService } from './application/economy.service';
import { WalletOrmEntity } from '../games/infrastructure/repositories/wallet.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletOrmEntity])],
  providers: [EconomyService],
  exports: [EconomyService],
})
export class EconomyModule {}
