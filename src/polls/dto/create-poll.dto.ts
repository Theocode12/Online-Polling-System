import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  expires_at: string;
}
