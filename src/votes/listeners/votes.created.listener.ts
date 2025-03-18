import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VoteCreatedEvent } from '../events/votes.created.event';
import { VoteCacheService } from 'src/cache/vote-cache.service';
import { PollsGateway } from 'src/polls/websockets/polls.gateway';

@Injectable()
export class VoteCreatedListener {
  constructor(private readonly voteCacheService: VoteCacheService, private readonly pollsGateway: PollsGateway) {}
  
  @OnEvent('vote.created')
  async handleVoteCreatedEvent(event: VoteCreatedEvent) {
    await this.voteCacheService.incrementVoteCount(event.pollId, event.pollOptionId)

    await this.pollsGateway.broadcastPollUpdate(event.pollId)
  }
}