import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DonationCase } from './donation-case.entity';

@Entity('case_images')
export class CaseImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @ManyToOne(() => DonationCase, (donationCase) => donationCase.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  donationCase: DonationCase;
}
