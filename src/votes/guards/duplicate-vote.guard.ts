import {
    CanActivate,
    ConflictException,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Vote } from '../entities/vote.entity';
  
  @Injectable()
  export class DuplicateVoteGuard implements CanActivate {
    constructor(
      @InjectRepository(Vote)
      private voteRepository: Repository<Vote>,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { pollOptionId } = request.body;
  
      if (!user) {
        throw new UnauthorizedException('You must be logged in to vote');
      }
  
      const existingVote = await this.voteRepository.findOne({
        where: { pollOptionId, userId: user.id },
      });

      if (existingVote) {
        throw new ConflictException({
            message: 'You have already voted for this option',
            vote: existingVote,
        });
      }
  
      return true;
    }
  }
  