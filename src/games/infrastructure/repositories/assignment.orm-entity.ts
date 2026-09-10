import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('assignments')
export class AssignmentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'game_id' })
  gameId: string;

  @Column({ name: 'classroom_id' })
  classroomId: string;

  @CreateDateColumn({ name: 'assigned_at', type: 'datetime' })
  assignedAt: Date;

  @Column({ name: 'due_at', type: 'datetime', nullable: true })
  dueAt: Date | null;
}
