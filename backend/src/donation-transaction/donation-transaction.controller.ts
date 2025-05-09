import {
    Controller,
    Get,
    UseGuards,
  } from '@nestjs/common';
  import { DonationTransactionService } from './donation-transaction.service';
  import { AuthGuard } from '@nestjs/passport';
  import { User } from '../user/user.entity';
  import { User as UserDecorator } from '../common/decorators/user.decorator';
  
  @Controller('donations')
  export class DonationTransactionController {
    constructor(
      private readonly transactionService: DonationTransactionService,
    ) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Get('my')
    getMyDonations(@UserDecorator() user: User) {
      return this.transactionService.getDonationsByUser(user.id);
    }
  }