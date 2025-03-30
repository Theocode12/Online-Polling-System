import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PollOptionsService } from 'src/poll_options/poll_options.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { VoteCreatedEvent } from './events/votes.created.event';
import { VoteDeletedEvent } from './events/votes.deleted.event';
import { Poll } from 'src/polls/entities/poll.entity';

describe('VotesService', () => {
  let service: VotesService;
  let voteRepository: Repository<Vote>;
  let pollOptionsService: PollOptionsService;
  let eventEmitter: EventEmitter2;

  const mockVoteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPollOptionsService = {
    findOneOrFail: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
        {
          provide: PollOptionsService,
          useValue: mockPollOptionsService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    pollOptionsService = module.get<PollOptionsService>(PollOptionsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vote', async () => {
      const createVoteDto: CreateVoteDto = {
        pollOptionId: 'poll-option-id',
      };
      const user: User = { id: 'user-id' } as User;
      const pollOption: PollOption = {
        id: 'poll-option-id',
        pollId: 'poll-id',
      } as PollOption;
      const expectedVote: Partial<Vote> = {
        ...CreateVoteDto,
        id: 'vote-id',
        pollOptionId: pollOption.id,
        user,
        pollOption,
      };

      mockPollOptionsService.findOneOrFail.mockResolvedValue(pollOption);
      mockVoteRepository.create.mockReturnValue(expectedVote);
      mockVoteRepository.save.mockResolvedValue(expectedVote);

      const result = await service.create(createVoteDto, user);

      expect(mockPollOptionsService.findOneOrFail).toHaveBeenCalledWith(
        createVoteDto.pollOptionId,
      );
      expect(mockVoteRepository.create).toHaveBeenCalledWith({
        ...createVoteDto,
        user,
        pollOption,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'vote.created',
        new VoteCreatedEvent(pollOption.pollId, pollOption.id),
      );
      expect(result).toEqual(expectedVote);
    });

    it('should throw NotFoundException if poll option is not found', async () => {
      const createVoteDto: CreateVoteDto = {
        pollOptionId: 'poll-option-id',
      };
      const user: User = { id: 'user-id' } as User;
      mockPollOptionsService.findOneOrFail.mockRejectedValue(
        new Error(),
      );

      await expect(service.create(createVoteDto, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all votes', async () => {
      const expectedVotes = [
        { id: 'vote-id-1', pollOptionId: 'poll-option-id-1' },
        { id: 'vote-id-2', pollOptionId: 'poll-option-id-2' },
      ] as Vote[];
      mockVoteRepository.find.mockResolvedValue(expectedVotes);

      const result = await service.findAll();

      expect(mockVoteRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedVotes);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a vote by id', async () => {
      const expectedVote = {
        id: 'vote-id',
        pollOptionId: 'poll-option-id',
      } as Vote;
      mockVoteRepository.findOneOrFail.mockResolvedValue(expectedVote);

      const result = await service.findOneOrFail('vote-id');

      expect(mockVoteRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'vote-id' },
        relations: [],
      });
      expect(result).toEqual(expectedVote);
    });

    it('should return a vote by id with relations', async () => {
      const expectedVote = {
        id: 'vote-id',
        pollOptionId: 'poll-option-id',
        user: { id: 'user-id' },
      } as Vote;
      mockVoteRepository.findOneOrFail.mockResolvedValue(expectedVote);

      const result = await service.findOneOrFail('vote-id', ['user']);

      expect(mockVoteRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'vote-id' },
        relations: ['user'],
      });
      expect(result).toEqual(expectedVote);
    });

    it('should throw NotFoundException if vote is not found', async () => {
      mockVoteRepository.findOneOrFail.mockRejectedValue(
        new Error(),
      );

      await expect(service.findOneOrFail('vote-id')).rejects.toThrow(
        Error,
      );
    });
  });

  describe('update', () => {
    it('should update a vote', async () => {
      const updateVoteDto: UpdateVoteDto = {
        pollOptionId: 'poll-option-id-2',
      };
      const user: User = { id: 'user-id' } as User;
      const existingVote: Vote = {
        id: 'vote-id',
        pollOptionId: 'poll-option-id',
        user,
      } as Vote;
      const updatedVote: Partial<Vote> = {
        id: 'vote-id',
        ...updateVoteDto,
        user,
      };

      mockVoteRepository.findOneOrFail.mockResolvedValue(existingVote);
      mockVoteRepository.update.mockResolvedValue(undefined);
      mockVoteRepository.findOneOrFail.mockResolvedValue(updatedVote);

      const result = await service.update('vote-id', updateVoteDto, user);

      expect(mockVoteRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'vote-id' },
        relations: ['user'],
      });
      expect(mockVoteRepository.update).toHaveBeenCalledWith(
        'vote-id',
        updateVoteDto,
      );
      expect(mockVoteRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'vote-id' },
      });
      expect(result).toEqual(updatedVote);
    });

    it('should throw NotFoundException if vote is not found', async () => {
      const updateVoteDto: UpdateVoteDto = {
        pollOptionId: 'poll-option-id-2',
      };
      const user: User = { id: 'user-id' } as User;
      mockVoteRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.update('vote-id', updateVoteDto, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const updateVoteDto: UpdateVoteDto = {
        pollOptionId: 'poll-option-id-2',
      };
      const user: User = { id: 'user-id-2' } as User;
      const existingVote: Vote = {
        id: 'vote-id',
        pollOptionId: 'poll-option-id',
        user: { id: 'user-id' },
      } as Vote;
      mockVoteRepository.findOneOrFail.mockResolvedValue(existingVote);

      await expect(
        service.update('vote-id', updateVoteDto, user),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a vote', async () => {
      const user: User = { id: 'user-id' } as User;
      const pollOption: PollOption = {
        id: 'poll-option-id',
        pollId: 'poll-id',
      } as PollOption;
      const existingVote: Vote = {
        id: 'vote-id',
        pollOptionId: pollOption.id,
        pollOption,
        user,
      } as Vote;
      mockVoteRepository.findOneOrFail.mockResolvedValue(existingVote);
      mockVoteRepository.delete.mockResolvedValue(undefined);

      const result = await service.remove('vote-id', user);

      expect(mockVoteRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'vote-id' },
        relations: ['user', 'pollOption'],
      });
      expect(mockVoteRepository.delete).toHaveBeenCalledWith('vote-id');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'vote.deleted',
        new VoteDeletedEvent(pollOption.pollId, pollOption.id),
      );
      expect(result).toEqual({ message: 'Vote deleted successfully' });
    });

    it('should throw NotFoundException if vote is not found', async () => {
      const user: User = { id: 'user-id' } as User;
      mockVoteRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.remove('vote-id', user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const user: User = { id: 'user-id-2' } as User;
      const existingVote: Vote = {
        id: 'vote-id',
        pollOption: { id: 'poll-option-id', pollId: 'poll-id' },
        user: { id: 'user-id' },
      } as Vote;
      mockVoteRepository.findOneOrFail.mockResolvedValue(existingVote);

      await expect(service.remove('vote-id', user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

