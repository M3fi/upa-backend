import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('wallets')
export class WalletOrmEntity {
  @PrimaryColumn({ name: 'student_id' })
  studentId: string;

  @Column({ default: 0 })
  coins: number;
}
