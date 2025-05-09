import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DonationCaseModule } from './donation-case/donation-case.module';

import { DonationCase } from './donation-case/donation-case.entity';
import { DonationTransaction } from './donation-transaction/donation-transaction.entity';
import { User } from './user/user.entity';
import { DonationTransactionModule } from './donation-transaction/donation-transaction.module';
console.log('💥 AppModule loaded');
console.log('✅ Importing AuthModule...');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'charityapp.sqlite',
      entities: [User, DonationCase, DonationTransaction],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    DonationCaseModule,
    DonationTransactionModule,
  ],
})
export class AppModule {}