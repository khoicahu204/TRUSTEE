import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { DonationCase } from '../donation-case/donation-case.entity';

@Entity('donation_transactions')
export class DonationTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  amount: number;

  

  @CreateDateColumn()
  created_at: Date;

  

  @ManyToOne(() => User, (user) => user.donationTransactions, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => DonationCase, (donationCase) => donationCase.donationTransactions, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  donationCase: DonationCase;
}
