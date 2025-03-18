import { CreatePollDto } from './create-poll.dto';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdatePollDto extends PartialType(CreatePollDto) {
  // @IsUUID()
  // pollId: string
}
