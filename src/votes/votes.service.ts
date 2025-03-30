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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VoteCreatedEvent } from './events/votes.created.event';
import { VoteDeletedEvent } from './events/votes.deleted.event';
import { PollOptionsService } from 'src/poll_options/poll_options.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    private pollOptionService: PollOptionsService,
    private eventEmitter: EventEmitter2
  ) {}

  getRepository() {
    return this.voteRepository;
  }

  async create(createVoteDto: CreateVoteDto, user: User) {
    const pollOption = await this.pollOptionService.findOneOrFail(createVoteDto.pollOptionId).catch(() => {
      throw new NotFoundException('Poll Option not found')
    });

    let vote = this.voteRepository.create({ ...createVoteDto, user, pollOption });
    console.log(vote)
    const voteCreatedEvent = new VoteCreatedEvent(vote.pollOption.pollId, vote.pollOptionId);
    
    vote = await this.voteRepository.save(vote).then((savedVote) => {
      this.eventEmitter.emit('vote.created',voteCreatedEvent);
      return savedVote;
    });

    return vote;
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
    const vote = await this.findOneOrFail(id, ['user', 'pollOption']).catch(() => {
      throw new NotFoundException('Vote not found');
    });

    if (vote.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this vote',
      );
    }
  
    const voteDeletedEvent = new VoteDeletedEvent(vote.pollOption.pollId, vote.pollOptionId)

    return this.voteRepository.delete(id).then(() => {
      this.eventEmitter.emit('vote.deleted', voteDeletedEvent);
      return { message: 'Vote deleted successfully' };
    });
  }
}
