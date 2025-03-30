import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePollOptionDto } from './create-poll_option.dto';

export class UpdatePollOptionDto extends PartialType(
  PickType(CreatePollOptionDto, ['description', 'pollId'])
) {}
