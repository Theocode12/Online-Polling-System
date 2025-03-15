import { CreatePollDto } from './create-poll.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdatePollDto extends PartialType(CreatePollDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  expires_at?: string;
}
