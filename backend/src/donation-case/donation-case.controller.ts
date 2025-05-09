import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { DonationCaseService } from './donation-case.service';
import { AuthGuard } from '@nestjs/passport';
import { User as UserDecorator } from '../common/decorators/user.decorator';
import { Role } from '../common/decorators/role.decorator';
import { User } from '../user/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateDonationCaseDto } from '../common/dto/donation-case.dto';
import { CreateDonationDto } from '../common/dto/donation-transaction.dto';
import { UpdateDonationCaseDto } from '../common/dto/update-donation-case.dto';

@Controller('cases')
export class DonationCaseController {
  constructor(private readonly donationCaseService: DonationCaseService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/approve')
  @Role('admin')
  approveCase(@Param('id') id: number) {
    return this.donationCaseService.approveCase(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Get('pending')
  getPendingCases() {
    return this.donationCaseService.getPendingCases();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Delete(':id')
  deleteCase(@Param('id') id: number) {
    return this.donationCaseService.deleteCase(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateCase(
    @Param('id') id: number,
    @Body() body: UpdateDonationCaseDto,
    @UserDecorator() user: User,
  ) {
    return this.donationCaseService.updateCase(id, user, body);
  }

  @Post()
  createCase(@Body() body: CreateDonationCaseDto, @UserDecorator() user: User) {
    return this.donationCaseService.createCase(body, user);
  }

  @Post(':id/donate')
  donateToCase(
    @Param('id') caseId: number,
    @Body() body: CreateDonationDto, // ✅ dùng DTO cho donation
    @UserDecorator() user: User,
  ) {
    return this.donationCaseService.donateToCase(caseId, body.amount, user);
  }

  @Get()
  getApprovedCases() {
    return this.donationCaseService.getApprovedCases();
  }

  @Get(':id/summary')
  getCaseSummary(@Param('id') id: number) {
    return this.donationCaseService.getCaseSummary(id);
  }

  @Get(':id')
  getCaseDetail(@Param('id') id: number) {
    return this.donationCaseService.getCaseDetail(id);
  }
}
