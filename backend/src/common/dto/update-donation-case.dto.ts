import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateDonationCaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  goalAmount?: number;
}