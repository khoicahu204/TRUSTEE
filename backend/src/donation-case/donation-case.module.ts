import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationCase } from './donation-case.entity';
import { DonationCaseService } from './donation-case.service';
import { DonationCaseController } from './donation-case.controller';
import { User } from '../user/user.entity';
import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DonationCase, User, DonationTransaction])],
  controllers: [DonationCaseController],
  providers: [DonationCaseService],
})
export class DonationCaseModule {}