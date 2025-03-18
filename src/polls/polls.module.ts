import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { PollsGateway } from './websockets/polls.gateway';
import { AppCacheModule } from 'src/cache/cache.module';
import { WebSocketDocsController } from './websocket-docs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll]), AppCacheModule],
  controllers: [PollsController, WebSocketDocsController],
  providers: [PollsService, PollsGateway],
  exports: [PollsService, PollsGateway],
})
export class PollsModule {}
