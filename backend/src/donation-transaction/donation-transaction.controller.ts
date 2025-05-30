import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DonationTransactionService } from './donation-transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { User as UserEntity } from '../user/user.entity';
import { User as UserDecorator } from '../common/decorators/user.decorator';

@Controller('donations')
export class DonationTransactionController {
  constructor(
    private readonly transactionService: DonationTransactionService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyDonations(@UserDecorator() user: UserEntity) {
    return this.transactionService.getDonationsByUser(user.id);
  }

  
}
