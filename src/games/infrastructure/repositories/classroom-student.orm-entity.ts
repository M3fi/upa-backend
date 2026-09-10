import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('classroom_students')
export class ClassroomStudentOrmEntity {
  @PrimaryColumn({ name: 'classroom_id' })
  classroomId: string;

  @PrimaryColumn({ name: 'student_id' })
  studentId: string;

  @CreateDateColumn({ type: 'datetime', name: 'joined_at' })
  joinedAt: Date;
}
