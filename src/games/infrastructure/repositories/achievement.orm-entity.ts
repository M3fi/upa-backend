import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('achievements')
export class AchievementOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 20 })
  rarity: string;

  @Column({ type: 'jsonb' })
  criteria: Record<string, unknown>;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
