import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseService } from 'src/lib/base.service';

@Injectable()
export class PollsService extends BaseService<Poll> {
  constructor(
    @InjectRepository(Poll)
    private pollRepository: Repository<Poll>,
  ) {
    super(pollRepository);
  }

  async create(createPollDto: CreatePollDto, user: User) {
    return await super.createAndSave({ ...createPollDto, user: user })
  }

  async findAll(relations: string[] = []) {
    return await super.findAll(relations);
  }

  async findOneOrFail(id: string, relations: string[] = []) {
    return await super.findOneOrFail(id, relations);
  }

  async update(id: string, updatePollDto: UpdatePollDto, user: User) {
    const poll = await this.findOneOrFail(id, ['user']).catch(() => {
      throw new NotFoundException('Poll not found');
    });
  
    if (poll.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to update this poll');
    }
  
    return await super.updateAndReturn(id, updatePollDto);
  }

  async remove(id: string, user: any) {
    const poll = await this.findOneOrFail(id, ['user']).catch(() => {
      throw new NotFoundException('Poll not found');
    });

    if (poll.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this poll',
      );
    }

    return await super.delete(id);
  }
}
