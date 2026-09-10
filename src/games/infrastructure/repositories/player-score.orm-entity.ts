import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssignmentOrmEntity } from './assignment.orm-entity';

@Entity('player_scores')
export class PlayerScoreOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'assignment_id' })
  assignmentId: string;

  @ManyToOne(() => AssignmentOrmEntity)
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentOrmEntity;

  @Column()
  score: number;

  @CreateDateColumn({ type: 'datetime', name: 'completed_at' })
  completedAt: Date;
}
