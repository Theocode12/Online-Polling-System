import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  expires_at: Date;
}
