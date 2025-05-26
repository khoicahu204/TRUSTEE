import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { DonationCase } from '../donation-case/donation-case.entity';
import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({ nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => DonationCase, (donationCase) => donationCase.user)
  donationCases: DonationCase[];

  @OneToMany(() => DonationTransaction, (tx) => tx.user)
  donationTransactions: DonationTransaction[];
}
