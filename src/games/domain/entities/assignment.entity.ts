export class Assignment {
  constructor(
    public readonly id: string,
    public readonly gameId: string,
    public readonly classroomId: string,
    public readonly assignedAt: Date,
    public readonly dueAt: Date | null,
  ) {}
}
