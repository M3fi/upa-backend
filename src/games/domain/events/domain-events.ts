export interface DomainEvent {
  eventName: string;
  occurredAt: Date;
  aggregateId: string;
}

export class AnswerSubmittedEvent implements DomainEvent {
  public readonly eventName = 'AnswerSubmitted';
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly studentId: string,
    public readonly gameId: string,
    public readonly isCorrect: boolean,
    public readonly elapsedMs: number,
    public readonly streak: number,
  ) {
    this.occurredAt = new Date();
  }
}

export class ScoreUpdatedEvent implements DomainEvent {
  public readonly eventName = 'ScoreUpdated';
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly studentId: string,
    public readonly gameId: string,
    public readonly delta: number,
    public readonly newTotal: number,
  ) {
    this.occurredAt = new Date();
  }
}

export class StreakAchievedEvent implements DomainEvent {
  public readonly eventName = 'StreakAchieved';
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly studentId: string,
    public readonly streakLength: number,
  ) {
    this.occurredAt = new Date();
  }
}

export class GameCompletedEvent implements DomainEvent {
  public readonly eventName = 'GameCompleted';
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly studentId: string,
    public readonly gameId: string,
    public readonly finalScore: number,
    public readonly perfect: boolean,
  ) {
    this.occurredAt = new Date();
  }
}

export class AchievementUnlockedEvent implements DomainEvent {
  public readonly eventName = 'AchievementUnlocked';
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly studentId: string,
    public readonly achievementId: string,
    public readonly rarity: string,
  ) {
    this.occurredAt = new Date();
  }
}

export class RewardGrantedEvent implements DomainEvent {
  public readonly eventName = 'RewardGranted';
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly studentId: string,
    public readonly rewardType: string,
    public readonly amount: number,
  ) {
    this.occurredAt = new Date();
  }
}

export type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;

export class DomainEventBus {
  private handlers = new Map<string, DomainEventHandler[]>();

  subscribe(eventName: string, handler: DomainEventHandler): void {
    const existing = this.handlers.get(eventName) || [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch {
        // Silently catch handler errors so one failing handler
        // doesn't break the entire flow (e.g. Redis unavailable)
      }
    }
  }
}

// Singleton bus for the app
export const domainEventBus = new DomainEventBus();
