import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { CaseImage } from './case-image.entity';
import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';

@Entity('donation_cases')
export class DonationCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  target_amount: number;

  @Column({ default: 0 })
  current_amount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.donationCases, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CaseImage, (image) => image.donationCase, { cascade: true })
  images: CaseImage[];

  @OneToMany(() => DonationTransaction, (tx) => tx.donationCase)
  donationTransactions: DonationTransaction[];
}
