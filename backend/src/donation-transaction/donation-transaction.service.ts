import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationTransaction } from './donation-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DonationTransactionService {
  constructor(
    @InjectRepository(DonationTransaction)
    private readonly donationRepo: Repository<DonationTransaction>,
  ) {}

  async getDonationsByUser(userId: number) {
    return this.donationRepo.find({
      where: { donor: { id: userId } },
      relations: ['donationCase'],
      order: { donatedAt: 'DESC' },
    });
  }
}