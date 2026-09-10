export class PlayerScore {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly assignmentId: string,
    public readonly score: number,
    public readonly completedAt: Date,
    public readonly gameId?: string,
  ) {}
}
