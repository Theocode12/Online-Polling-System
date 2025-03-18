import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class VoteCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(PollOption) private readonly pollOptionRepository: Repository<PollOption>,
  ) {}

  private getPollKey(pollId: string): string {
    return `poll_${pollId}`;
  }

  async getPollData(pollId: string) {
    const key = this.getPollKey(pollId);
    const data = await this.cacheManager.get<string>(key);
    return data ? JSON.parse(data) : null;
  }

  async initializePollCache(pollId: string) {
    const key = this.getPollKey(pollId);

    // Fetch poll options from the database
    const pollOptions = await this.pollOptionRepository.find({ where: { pollId } });

    console.log(pollId);

    if (!pollOptions.length) {
      throw new Error(`Poll ${pollId} has no options.`);
    }

    // Fetch vote counts from the database
    const voteCounts = await this.voteRepository
      .createQueryBuilder('vote')
      .select('pollOptionId, COUNT(*) AS count')
      .where('vote.pollOptionId IN (:...options)', { options: pollOptions.map(o => o.id) })
      .groupBy('pollOptionId')
      .getRawMany();

    // Convert to a lookup object for quick access
    const voteMap = voteCounts.reduce((acc, { pollOptionId, count }) => {
      acc[pollOptionId] = Number(count);
      return acc;
    }, {} as Record<string, number>);

    // Build poll data with up-to-date vote counts
    const pollData = {
      poll_id: pollId,
      poll_options: pollOptions.map(option => ({
        id: option.id,
        title: option.title,
        votes: voteMap[option.id] || 0, // Use DB count or default to 0
      })),
    };

    await this.cacheManager.set(key, JSON.stringify(pollData));
    return pollData;
  }

  async incrementVoteCount(pollId: string, pollOptionId: string) {
    const key = this.getPollKey(pollId);
    let pollData = await this.getPollData(pollId);

    if (!pollData) {
      return await this.initializePollCache(pollId); // Sync cache if expired
    }

    pollData.poll_options = pollData.poll_options.map(option =>
      option.id === pollOptionId ? { ...option, votes: option.votes + 1 } : option,
    );

    await this.cacheManager.set(key, JSON.stringify(pollData));
  }

  async decrementVoteCount(pollId: string, pollOptionId: string) {
    const key = this.getPollKey(pollId);
    let pollData = await this.getPollData(pollId);

    if (!pollData) {
      return await this.initializePollCache(pollId);
    }

    pollData.poll_options = pollData.poll_options.map(option =>
      option.id === pollOptionId ? { ...option, votes: Math.max(0, option.votes - 1) } : option,
    );

    await this.cacheManager.set(key, JSON.stringify(pollData));
  }

  async clearPollCache(pollId: string) {
    const key = this.getPollKey(pollId);
    await this.cacheManager.del(key);
  }
}
