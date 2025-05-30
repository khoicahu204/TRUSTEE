import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { DonationCase } from '../donation-case/donation-case.entity';
import { DonationTransaction } from '../donation-transaction/donation-transaction.entity';

import { JwtStrategy } from './jwt.strategy';


console.log('🧩 AuthModule loaded');
@Module({
  imports: [
    TypeOrmModule.forFeature([User, DonationCase, DonationTransaction]),
    PassportModule,
    JwtModule.register({
      secret: 'supersecretkey', // sau này dùng env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
