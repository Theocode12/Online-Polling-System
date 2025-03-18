import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { AppCacheModule } from 'src/cache/cache.module';
import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { Poll } from 'src/polls/entities/poll.entity';
import { VoteCreatedListener } from './listeners/votes.created.listener';
import { VoteDeletedListener } from './listeners/votes.deleted.listener';
import { PollsModule } from 'src/polls/polls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, PollOption, Poll]), AppCacheModule, PollsModule],
  controllers: [VotesController],
  providers: [VotesService, VoteCreatedListener, VoteDeletedListener],
})
export class VotesModule {}
