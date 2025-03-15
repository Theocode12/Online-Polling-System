import { PartialType } from '@nestjs/mapped-types';
import { CreatePollOptionDto } from './create-poll_option.dto';
import { IsString } from 'class-validator';

export class UpdatePollOptionDto extends PartialType(CreatePollOptionDto) {
  @IsString()
  description?: string;
}
