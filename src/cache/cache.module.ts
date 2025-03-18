import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { VoteCacheService } from './vote-cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from 'src/votes/entities/vote.entity';
import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfigService } from 'src/lib/config/cache-config.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Vote, PollOption]),
  ],
  providers: [VoteCacheService],
  exports: [VoteCacheService, CacheModule], // Export for use in other modules
})
export class AppCacheModule {}
