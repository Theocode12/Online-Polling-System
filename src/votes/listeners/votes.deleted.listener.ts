import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VoteCacheService } from 'src/cache/vote-cache.service';
import { VoteDeletedEvent } from '../events/votes.deleted.event';
import { PollsGateway } from 'src/polls/websockets/polls.gateway';

@Injectable()
export class VoteDeletedListener {
  constructor(private readonly voteCacheService: VoteCacheService, private readonly pollsGateway: PollsGateway) {}
  
  @OnEvent('vote.deleted')
  async handleVotedDeletedEvent(event: VoteDeletedEvent) {
    await this.voteCacheService.decrementVoteCount(event.pollId, event.pollOptionId);

    await this.pollsGateway.broadcastPollUpdate(event.pollId);
  }
}