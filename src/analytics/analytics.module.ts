import { Module } from '@nestjs/common';
import { AnalyticsService } from './application/analytics.service';

@Module({
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
