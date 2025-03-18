import { PickType } from '@nestjs/mapped-types';
import { CreatePollOptionDto } from './create-poll_option.dto';

export class UpdatePollOptionDto extends PickType(CreatePollOptionDto, ['description', 'pollId']) {}
