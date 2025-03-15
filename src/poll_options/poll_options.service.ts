import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePollOptionDto } from './dto/create-poll_option.dto';
import { UpdatePollOptionDto } from './dto/update-poll_option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PollOption } from './entities/poll_option.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PollsService } from 'src/polls/polls.service';
import { Poll } from 'src/polls/entities/poll.entity';

@Injectable()
export class PollOptionsService {
  constructor(
    @InjectRepository(PollOption)
    private pollOptionRepository: Repository<PollOption>,
    private pollService: PollsService,
  ) {}

  async create(createPollOptionDto: CreatePollOptionDto, user: User) {
    const poll: Poll = await this.pollService.findOneOrFail(
      createPollOptionDto.pollId, ['user']
    ).catch(() => {
      throw new NotFoundException('PollOption not found');
    });

    if (user.id !== poll.user.id) {
      throw new UnauthorizedException(
        'You are not authorized to create a poll-option for this poll',
      );
    }

    return await this.pollOptionRepository.save(createPollOptionDto);
  }

  async findAll() {
    return await this.pollOptionRepository.find();
  }

  async findOneOrFail(id: string, relations: string[] = []) {
    return await this.pollOptionRepository.findOneOrFail({ where: { id: id }, relations: relations });
  }

  async update(
    id: string,
    updatePollOptionDto: UpdatePollOptionDto,
    user: User,
  ) {
   
    const pollOption = await this.findOneOrFail(id, ['poll', 'poll.user']).catch(() => {
        throw new NotFoundException('PollOption not found');
      });
    
    if (pollOption.poll.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this poll option',
      );
    }

    await this.pollOptionRepository.update(id, updatePollOptionDto);
    return await this.pollOptionRepository.findOneOrFail({ where: { id: id } });
  }

  async remove(id: string, user: any) {
    const pollOption = await this.findOneOrFail(id, ['poll', 'poll.user']).catch(() => {
      throw new NotFoundException('PollOption not found');
    });

    if (pollOption.poll.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this pollOption',
      );
    }

    return await this.pollOptionRepository.delete(id);
  }
}
