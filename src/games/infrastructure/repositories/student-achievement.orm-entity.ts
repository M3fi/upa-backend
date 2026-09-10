import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('student_achievements')
export class StudentAchievementOrmEntity {
  @PrimaryColumn({ name: 'student_id' })
  studentId: string;

  @PrimaryColumn({ name: 'achievement_id' })
  achievementId: string;

  @CreateDateColumn({ type: 'datetime', name: 'unlocked_at' })
  unlockedAt: Date;
}
