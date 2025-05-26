import { Module } from '@nestjs/common';
import { DonationTransactionController } from './donation-transaction.controller';
import { DonationTransactionService } from './donation-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationTransaction } from './donation-transaction.entity';
import { DonationCase } from '../donation-case/donation-case.entity'; // 👈 thêm dòng này


@Module({
  imports: [TypeOrmModule.forFeature([DonationTransaction, DonationCase])], // 👈 thêm DonationCase vào đây
  controllers: [DonationTransactionController],
  providers: [DonationTransactionService],
})
export class DonationTransactionModule {}