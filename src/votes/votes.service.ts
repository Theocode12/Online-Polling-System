import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async create(createVoteDto: CreateVoteDto, user: User) {
    const vote = this.voteRepository.create({ ...createVoteDto, user: user });
    return await this.voteRepository.save(vote);
  }

  async findAll() {
    return await this.voteRepository.find();
  }

  async findOneOrFail(id: string, relations: string[] = []) {
    return await this.voteRepository.findOneOrFail({ where: { id: id }, relations });
  }

  async update(id: string, updateVoteDto: UpdateVoteDto, user: any) {
    const vote = await this.findOneOrFail(id, ['user']).catch(() => {
      throw new NotFoundException('Vote not found');
    });

    if (vote.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this vote',
      );
    }

    await this.voteRepository.update(id, updateVoteDto);
    return await this.voteRepository.findOneOrFail({ where: { id: id } });
  }

  async remove(id: string, user: any) {
    const vote = await this.findOneOrFail(id, ['user']).catch(() => {
      throw new NotFoundException('Vote not found');
    });

    if (vote.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this vote',
      );
    }

    return await this.voteRepository.delete(id);
  }
}
