import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DonationTransactionService } from './donation-transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDonationDto } from '../common/dto/donation-transaction.dto';
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  donate(
    @Body() dto: CreateDonationDto,
    @UserDecorator() user: UserEntity,
  ) {
    return this.transactionService.donateToCase(
      dto.caseId,
      dto.amount,
      dto.payment_method,
      user,
    );
  }
}
