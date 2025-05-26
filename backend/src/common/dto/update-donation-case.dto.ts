// update-donation-case.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDonationCaseDto } from './donation-case.dto';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateDonationCaseDto extends PartialType(CreateDonationCaseDto) {
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';
}
