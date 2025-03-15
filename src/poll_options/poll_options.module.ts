import { Module } from '@nestjs/common';
import { PollOptionsService } from './poll_options.service';
import { PollOptionsController } from './poll_options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from './entities/poll_option.entity';
import { PollsModule } from 'src/polls/polls.module';

@Module({
  imports: [TypeOrmModule.forFeature([PollOption]), PollsModule],
  controllers: [PollOptionsController],
  providers: [PollOptionsService],
})
export class PollOptionsModule {}
