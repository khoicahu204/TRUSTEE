import { Module } from '@nestjs/common';
import { DonationTransactionController } from './donation-transaction.controller';
import { DonationTransactionService } from './donation-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationTransaction } from './donation-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DonationTransaction])],
  controllers: [DonationTransactionController],
  providers: [DonationTransactionService],
})
export class DonationTransactionModule {}