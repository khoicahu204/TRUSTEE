import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationTransaction } from './donation-transaction.entity';
import { Repository } from 'typeorm';
import { DonationCase } from '../donation-case/donation-case.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DonationTransactionService {
  constructor(
    @InjectRepository(DonationTransaction)
    private readonly donationRepo: Repository<DonationTransaction>,

    @InjectRepository(DonationCase)
    private readonly caseRepo: Repository<DonationCase>,
  ) {}

  async getDonationsByUser(userId: number) {
    return this.donationRepo.find({
      where: { user: { id: userId } },
      relations: ['donationCase'],
      order: { created_at: 'DESC' },
    });
  }

  
}
