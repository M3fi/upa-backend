import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { HealthModule } from './health/health.module';
import { ScoringModule } from './scoring/scoring.module';
import { AchievementModule } from './achievements/achievement.module';
import { EconomyModule } from './economy/economy.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { configValidationSchema } from './infrastructure/config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
      validationSchema: configValidationSchema,
      validationOptions: { abortEarly: true },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        ...(process.stdout.isTTY ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss.l' },
          },
        } : {
          // JSON output when not in TTY (e.g. Docker, background processes)
          transport: undefined,
        }),
        autoLogging: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DB_TYPE', 'sqlite');
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get<string>('DB_USERNAME', 'upa'),
            password: config.get<string>('DB_PASSWORD', 'upa_dev'),
            database: config.get<string>('DB_DATABASE', 'upa'),
            autoLoadEntities: true,
            synchronize: true,
          } as any;
        }
        return {
          type: 'better-sqlite3',
          database: config.get<string>('SQLITE_PATH', './data/upa.db'),
          autoLoadEntities: true,
          synchronize: true,
        } as any;
      },
    }),
    AuthModule,
    GamesModule,
    LeaderboardModule,
    HealthModule,
    ScoringModule,
    AchievementModule,
    EconomyModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
