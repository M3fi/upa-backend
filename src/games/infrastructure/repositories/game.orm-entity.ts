import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('games')
export class GameOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @Column({ name: 'template_type', length: 50 })
  templateType: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  content: Record<string, unknown>;

  @Column({ type: 'jsonb' })
  rules: Record<string, unknown>;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
