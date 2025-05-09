// src/common/dto/donation-transaction.dto.ts

import { IsInt, Min } from 'class-validator';

export class CreateDonationDto {
  @IsInt()
  @Min(1)
  amount: number;
}