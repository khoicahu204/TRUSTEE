import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../user/user.entity';
  import { DonationCase } from '../donation-case/donation-case.entity';
  
  @Entity()
  export class DonationTransaction {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('int')
    amount: number;
  
    @CreateDateColumn()
    donatedAt: Date;
  
    @ManyToOne(() => User, (user) => user.donations, { eager: true })
    donor: User;
  
    @ManyToOne(() => DonationCase, (donationCase) => donationCase.donationTransactions, { eager: true, onDelete: 'CASCADE' })
    donationCase: DonationCase;
  }