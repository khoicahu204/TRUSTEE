// src/common/dto/donation-transaction.dto.ts

import { IsInt, Min, IsEnum } from 'class-validator';

export class CreateDonationDto {

  @IsInt()
  caseId: number;

  @IsInt()
  @Min(10000)
  amount: number;

  @IsEnum(['momo', 'bank_transfer', 'manual'])
  payment_method: 'momo' | 'bank_transfer' | 'manual';
}