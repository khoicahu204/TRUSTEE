import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';
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
@UseGuards(AuthGuard('jwt'))
createCase(
  @Body() data: CreateDonationCaseDto,
  @UserDecorator() user: User,
) {
  return this.donationCaseService.createCase(data, user);
}

   @Post(':id/donate')
  @UseGuards(AuthGuard('jwt'))
  donateToCase(
    @Param('id') caseId: number,
    @Body() body: { amount: number; password: string },
    @UserDecorator() user: User,
  ) {
    return this.donationCaseService.donateToCase(caseId, body.amount, body.password, user);
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

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `case_image_${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = `/uploads/${file.filename}`;
    return { filename: file.filename, url };
  }
}
