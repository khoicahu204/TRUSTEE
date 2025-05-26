
import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsArray, ArrayMaxSize, IsUrl } from 'class-validator';

export class CreateDonationCaseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  target_amount: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsUrl({}, { each: true })
  images?: string[];
}