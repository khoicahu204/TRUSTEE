
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateDonationCaseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  goalAmount: number;
}