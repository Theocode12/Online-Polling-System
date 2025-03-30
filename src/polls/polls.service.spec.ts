import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { Repository } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdatePollDto } from './dto/update-poll.dto';

describe('PollsService', () => {
  let service: PollsService;

  const mockPollRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    metadata: {
      name: 'Poll',
      primaryColumns: jest.fn()
    }
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getRepositoryToken(Poll),
          useValue: mockPollRepository,
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a poll', async () => {
      const createPollDto: CreatePollDto = {
        title: 'Test Poll',
        description: 'This is a test poll',
        expires_at: new Date(),
      };
      const user: User = { id: 'user-id' } as User;
      const expectedPoll: Partial<Poll> = {
        ...createPollDto,
        id: 'poll-id',       
        user,
      };

      mockPollRepository.create.mockReturnValue(expectedPoll);
      mockPollRepository.save.mockResolvedValue(expectedPoll);

      const result = await service.create(createPollDto, user);

      expect(mockPollRepository.create).toHaveBeenCalledWith({
        ...createPollDto,
        user,
      });
      expect(mockPollRepository.save).toHaveBeenCalledWith(expectedPoll);
      expect(result).toEqual(expectedPoll);
    });
  });

  describe('findAll', () => {
    it('should return all polls', async () => {
      const expectedPolls = [
        { id: 'poll-id-1', title: 'Poll 1' },
        { id: 'poll-id-2', title: 'Poll 2' },
      ] as Poll[];
      mockPollRepository.find.mockResolvedValue(expectedPolls);

      const result = await service.findAll();

      expect(mockPollRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedPolls);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a poll by id', async () => {
      const expectedPoll = { id: 'poll-id', title: 'Test Poll' } as Poll;
      mockPollRepository.findOneOrFail.mockResolvedValue(expectedPoll);

      const result = await service.findOneOrFail('poll-id');

      expect(mockPollRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'poll-id' },
        relations: [],
      });
      expect(result).toEqual(expectedPoll);
    });

    it('should return a poll by id with relations', async () => {
      const expectedPoll = { id: 'poll-id', title: 'Test Poll', user: {id: 'user-id'} } as Poll;
      mockPollRepository.findOneOrFail.mockResolvedValue(expectedPoll);

      const result = await service.findOneOrFail('poll-id', ['user']);

      expect(mockPollRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'poll-id' },
        relations: ['user'],
      });
      expect(result).toEqual(expectedPoll);
    });

    it('should throw Error if poll is not found', async () => {
      mockPollRepository.findOneOrFail.mockRejectedValue(new Error());

      await expect(service.findOneOrFail('poll-id')).rejects.toThrow(
        Error,
      );
    });
  });

  describe('update', () => {
    it('should update a poll', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Poll' };
      const user: User = { id: 'user-id' } as User;
      const existingPoll = {
        id: 'poll-id',
        title: 'Test Poll',
        user: { id: 'user-id' },
      } as Poll;
      const updatedPoll: Partial<Poll> = {
        id: 'poll-id',
        ...updatePollDto,
        user,
      };

      mockPollRepository.findOneOrFail.mockResolvedValue(existingPoll);
      mockPollRepository.update.mockResolvedValue(undefined);
      mockPollRepository.findOneOrFail.mockResolvedValue(updatedPoll);

      const result = await service.update('poll-id', updatePollDto, user);

      expect(mockPollRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'poll-id' },
        relations: ['user'],
      });
      expect(mockPollRepository.update).toHaveBeenCalledWith(
        'poll-id',
        updatePollDto,
      );
      expect(mockPollRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 'poll-id' }, relations: [] });
      expect(result).toEqual(updatedPoll);
    });

    it('should throw NotFoundException if poll is not found', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Poll' };
      const user: User = { id: 'user-id' } as User;
      mockPollRepository.findOneOrFail.mockRejectedValue(new Error());

      await expect(
        service.update('poll-id', updatePollDto, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const updatePollDto: UpdatePollDto = { title: 'Updated Poll' };
      const user: User = { id: 'user-id-2' } as User;
      const existingPoll = {
        id: 'poll-id',
        title: 'Test Poll',
        user: { id: 'user-id' },
      } as Poll;
      mockPollRepository.findOneOrFail.mockResolvedValue(existingPoll);

      await expect(
        service.update('poll-id', updatePollDto, user),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a poll', async () => {
      const user: User = { id: 'user-id' } as User;
      const existingPoll = {
        id: 'poll-id',
        title: 'Test Poll',
        user: { id: 'user-id' },
      } as Poll;
      mockPollRepository.findOneOrFail.mockResolvedValue(existingPoll);
      mockPollRepository.delete.mockResolvedValue(undefined);

      const result = await service.remove('poll-id', user);

      expect(mockPollRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'poll-id' },
        relations: ['user'],
      });
      expect(mockPollRepository.delete).toHaveBeenCalledWith('poll-id');
      expect(result).toStrictEqual({"message": "Poll deleted successfully"});
    });

    it('should throw NotFoundException if poll is not found', async () => {
      const user: User = { id: 'user-id' } as User;
      mockPollRepository.findOneOrFail.mockRejectedValue(new NotFoundException());

      await expect(service.remove('poll-id', user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const user: User = { id: 'user-id-2' } as User;
      const existingPoll = {
        id: 'poll-id',
        title: 'Test Poll',
        user: { id: 'user-id' },
      } as Poll;
      mockPollRepository.findOneOrFail.mockResolvedValue(existingPoll);

      await expect(service.remove('poll-id', user)).rejects.toThrow(
        ForbiddenException,
      );
      });
  });
});
