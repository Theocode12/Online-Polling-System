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

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    private eventEmitter: EventEmitter2
  ) {}

  getRepository() {
    return this.voteRepository;
  }

  async create(createVoteDto: CreateVoteDto, user: User) {
    let vote = this.voteRepository.create({ ...createVoteDto, user: user });

    vote = await this.voteRepository.save(vote).then((savedVote) => {
      return savedVote;
    });

    vote = await this.findOneOrFail(vote.id, ['user', 'pollOption']);

    const voteCreatedEvent = new VoteCreatedEvent()
    voteCreatedEvent.pollId = vote.pollOption.pollId;
    voteCreatedEvent.pollOptionId = vote.pollOptionId;
    this.eventEmitter.emit('vote.created',voteCreatedEvent);

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

    
    const voteDeletedEvent = new VoteDeletedEvent()
    voteDeletedEvent.pollId = vote.pollOption.pollId;
    voteDeletedEvent.pollOptionId = vote.pollOptionId;

    return this.voteRepository.delete(id).then(() => {
      this.eventEmitter.emit('vote.deleted', voteDeletedEvent);
      return { message: 'Vote deleted successfully' };
    });
  }
}
