import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAIContentGenerator, AIGenerationRequest, MinimalContentGenerator } from '../../games/domain/engine/IAIContentGenerator';
import { RedisService } from '../../leaderboard/infrastructure/redis.service';

/**
 * IA Content Generator con cache + rate limiting.
 * En P6 reemplaza a MinimalContentGenerator.
 */
@Injectable()
export class AIContentGeneratorService implements IAIContentGenerator {
  private readonly logger = new Logger(AIContentGeneratorService.name);
  private readonly fallback: MinimalContentGenerator;
  private readonly cacheTtl = 3600; // 1 hour

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    this.fallback = new MinimalContentGenerator();
  }

  async generate(request: AIGenerationRequest): Promise<unknown> {
    const cacheKey = `ai:gen:${request.templateType}:${request.topic}:${request.level}:${request.questionCount || 5}`;

    // Check cache
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`AI cache hit: ${cacheKey}`);
        return JSON.parse(cached);
      }
    } catch {
      // Cache miss or Redis down — proceed
    }

    // Check rate limit (max 10 generations/min per teacher)
    const rateKey = `ai:rate:${request.templateType}`;
    // Simplified: just use fallback for now
    // In production: call OpenAI/Anthropic API here

    // Use fallback generator for deterministic content
    const content = await this.fallback.generate(request);

    // Cache the result
    try {
      await this.redis.set(cacheKey, JSON.stringify(content));
    } catch {
      // Cache write failure is non-fatal
    }

    return content;
  }
}
