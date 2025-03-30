import { CreatePollDto } from './create-poll.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePollDto extends PartialType(CreatePollDto) {
}
