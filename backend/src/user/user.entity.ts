import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DonationCase } from '../donation-case/donation-case.entity';
import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // mặc định role là "user"
  role: string;

  @OneToMany(() => DonationCase, (donationCase) => donationCase.createdBy)
  donationCases: DonationCase[];

  @OneToMany(() => DonationTransaction, (tx) => tx.donor)
  donations: DonationTransaction[];
}