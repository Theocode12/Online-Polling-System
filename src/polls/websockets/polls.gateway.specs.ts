import { Test, TestingModule } from '@nestjs/testing';
import { PollsGateway } from './polls.gateway';
import { PollsService } from '../polls.service';

describe('VotesGateway', () => {
  let gateway: PollsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollsGateway, PollsService],
    }).compile();

    gateway = module.get<PollsGateway>(PollsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});