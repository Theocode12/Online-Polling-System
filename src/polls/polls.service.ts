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

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollRepository: Repository<Poll>,
  ) {}

  async create(createPollDto: CreatePollDto, user: User) {
    const poll = this.pollRepository.create({ ...createPollDto, user: user });
    return await this.pollRepository.save(poll);
  }

  async findAll() {
    return await this.pollRepository.find();
  }

  async findOneOrFail(id: string, relations: string[] = []) {
    return await this.pollRepository.findOneOrFail({ where: { id: id }, relations });
  }

  async update(id: string, updatePollDto: UpdatePollDto, user: User) {
    const poll = await this.findOneOrFail(id, ['user']).catch(() => {
      throw new NotFoundException('Poll not found');
    });
  
    if (poll.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to update this poll');
    }
  
    await this.pollRepository.update(id, updatePollDto);
    return this.pollRepository.findOneOrFail({ where: { id } });
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

    return await this.pollRepository.delete(id);
  }
}
