import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { VotesService } from '../votes.service';
  
@Injectable()
export class VoteChangeGuard implements CanActivate {
  constructor(
    private votesService: VotesService,
    @InjectRepository(PollOption)
    private pollOptionRepository: Repository<PollOption>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { pollOptionId } = request.body;
    const voteRepository = this.votesService.getRepository();

    // Find the poll option to get the poll ID
    const pollOption = await this.pollOptionRepository.findOne({
      where: { id: pollOptionId },
      relations: ['poll'],
    });

    if (!pollOption) {
      throw new NotFoundException('Poll option not found');
    }

    const pollId = pollOption.poll.id;

    // **Use QueryBuilder to correctly find previous vote**
    const previousVote = await voteRepository
    .createQueryBuilder('vote')
    .innerJoinAndSelect('vote.pollOption', 'pollOption')
    .innerJoinAndSelect('pollOption.poll', 'poll')
    .where('vote.userId = :userId', { userId: user.id })
    .andWhere('poll.id = :pollId', { pollId })
    .getOne();


    if (previousVote) {
      
      // Proceed with deleting the old vote
      await this.votesService.remove(previousVote.id, user);
    }


    return true; // Allow the request to continue
  }
}
