export class Classroom {
  constructor(
    public readonly id: string,
    public readonly teacherId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly createdAt: Date,
  ) {}
}
