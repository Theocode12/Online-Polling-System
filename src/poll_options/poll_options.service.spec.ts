import { Test, TestingModule } from '@nestjs/testing';
import { PollOptionsService } from './poll_options.service';
import { Repository } from 'typeorm';
import { PollOption } from './entities/poll_option.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePollOptionDto } from './dto/create-poll_option.dto';
import { User } from 'src/users/entities/user.entity';
import { PollsService } from 'src/polls/polls.service';
import { UpdatePollOptionDto } from './dto/update-poll_option.dto';
import { Poll } from 'src/polls/entities/poll.entity';

describe('PollOptionsService', () => {
  let service: PollOptionsService;
  let pollOptionRepository: Repository<PollOption>;
  let pollsService: PollsService;

  const mockPollOptionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPollsService = {
    findOneOrFail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollOptionsService,
        {
          provide: getRepositoryToken(PollOption),
          useValue: mockPollOptionRepository,
        },
        {
          provide: PollsService,
          useValue: mockPollsService,
        },
      ],
    }).compile();

    service = module.get<PollOptionsService>(PollOptionsService);
    pollOptionRepository = module.get<Repository<PollOption>>(
      getRepositoryToken(PollOption),
    );
    pollsService = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a poll option', async () => {
      const createPollOptionDto: CreatePollOptionDto = {
        title: 'Test Poll Option',
        description: 'This is a test poll option',
        pollId: 'poll-id',
      };
      const user: User = { id: 'user-id' } as User;
      const expectedPollOption: Partial<PollOption> = {
        ...createPollOptionDto,
        id: 'poll-option-id',
      };
      const poll: Poll = { id: 'poll-id', user } as Poll;

      mockPollsService.findOneOrFail.mockResolvedValue(poll);
      mockPollOptionRepository.save.mockResolvedValue(expectedPollOption);

      const result = await service.create(createPollOptionDto, user);

      expect(mockPollsService.findOneOrFail).toHaveBeenCalledWith(createPollOptionDto.pollId, ['user']);
      expect(mockPollOptionRepository.save).toHaveBeenCalledWith(createPollOptionDto);
      expect(result).toEqual(expectedPollOption);
    });

    it('should throw NotFoundException if poll is not found', async () => {
      const createPollOptionDto: CreatePollOptionDto = {
        title: 'Test Poll Option',
        description: 'This is a test poll option',
        pollId: 'poll-id',
      };
      const user: User = { id: 'user-id' } as User;
      mockPollsService.findOneOrFail.mockRejectedValue(new Error());

      await expect(
        service.create(createPollOptionDto, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner of the poll', async () => {
      const createPollOptionDto: CreatePollOptionDto = {
        title: 'Test Poll Option',
        description: 'This is a test poll option',
        pollId: 'poll-id',
      };
      const user: User = { id: 'user-id-2' } as User;
      const poll: Poll = { id: 'poll-id', user: { id: 'user-id'} } as Poll;
      mockPollsService.findOneOrFail.mockResolvedValue(poll);

      await expect(
        service.create(createPollOptionDto, user),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return all poll options', async () => {
      const expectedPollOptions = [
        { id: 'poll-option-id-1', title: 'Poll Option 1' },
        { id: 'poll-option-id-2', title: 'Poll Option 2' },
      ] as PollOption[];
      mockPollOptionRepository.find.mockResolvedValue(expectedPollOptions);

      const result = await service.findAll();

      expect(mockPollOptionRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedPollOptions);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a poll option by id', async () => {
      const expectedPollOption = {
        id: 'poll-option-id',
        title: 'Test Poll Option',
      } as PollOption;
      mockPollOptionRepository.findOneOrFail.mockResolvedValue(
        expectedPollOption,
      );

      const result = await service.findOneOrFail('poll-option-id');

      expect(mockPollOptionRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'poll-option-id' },
        relations: [],
      });
      expect(result).toEqual(expectedPollOption);
    });

    it('should return a poll option by id with relations', async () => {
      const expectedPollOption = {
        id: 'poll-option-id',
        title: 'Test Poll Option',
        poll: { id: 'poll-id', user:{id:'user-id'}},
      } as PollOption;
      mockPollOptionRepository.findOneOrFail.mockResolvedValue(
        expectedPollOption,
      );

      const result = await service.findOneOrFail('poll-option-id', ['poll', 'poll.user']);

      expect(mockPollOptionRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'poll-option-id' },
        relations: ['poll', 'poll.user'],
      });
      expect(result).toEqual(expectedPollOption);
    });

    it('should throw NotFoundException if poll option is not found', async () => {
      mockPollOptionRepository.findOneOrFail.mockRejectedValue(
        new Error(),
      );

      await expect(
        service.findOneOrFail('poll-option-id'),
      ).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should update a poll option', async () => {
      const updatePollOptionDto: UpdatePollOptionDto = {
        description: 'Updated Poll Option description',
      };
      const user: User = { id: 'user-id' } as User;
      const existingPollOption: PollOption = {
        id: 'poll-option-id',
        title: 'Test Poll Option',
        poll: {id: 'poll-id', user},
      } as PollOption;
      const updatedPollOption: Partial<PollOption> = {
        ...existingPollOption,
        ...updatePollOptionDto,
      };

      mockPollOptionRepository.findOneOrFail.mockResolvedValue(
        existingPollOption,
      );
      mockPollOptionRepository.update.mockResolvedValue(undefined);

      const result = await service.update(
        'poll-option-id',
        updatePollOptionDto,
        user,
      );

      expect(
        mockPollOptionRepository.findOneOrFail,
      ).toHaveBeenCalledWith({
        where: { id: 'poll-option-id' },
        relations: ['poll', 'poll.user'],
      });
      expect(mockPollOptionRepository.update).toHaveBeenCalledWith(
        'poll-option-id',
        updatePollOptionDto,
      );

      expect(
        mockPollOptionRepository.findOneOrFail,
      ).toHaveBeenCalledWith({ where: { id: 'poll-option-id' } });
    });

    it('should throw NotFoundException if poll option is not found', async () => {
      const updatePollOptionDto: UpdatePollOptionDto = {
        description: 'Updated Poll Option',
      };
      const user: User = { id: 'user-id' } as User;
      mockPollOptionRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.update('poll-option-id', updatePollOptionDto, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const updatePollOptionDto: UpdatePollOptionDto = {
        description: 'Updated Poll Option',
      };
      const user: User = { id: 'user-id-2' } as User;
      const existingPollOption: PollOption = {
        id: 'poll-option-id',
        title: 'Test Poll Option',
        poll: {id: 'poll-id', user: {id: 'user-id'}},
      } as PollOption;
      mockPollOptionRepository.findOneOrFail.mockResolvedValue(
        existingPollOption,
      );

      await expect(
        service.update('poll-option-id', updatePollOptionDto, user),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a poll option', async () => {
      const user: User = { id: 'user-id' } as User;
      const existingPollOption: PollOption = {
        id: 'poll-option-id',
        title: 'Test Poll Option',
        poll: {id: 'poll-id', user},
      } as PollOption;
      mockPollOptionRepository.findOneOrFail.mockResolvedValue(
        existingPollOption,
      );
      mockPollOptionRepository.delete.mockResolvedValue(undefined);

      const result = await service.remove('poll-option-id', user);

      expect(
        mockPollOptionRepository.findOneOrFail,
      ).toHaveBeenCalledWith({
        where: { id: 'poll-option-id' },
        relations: ['poll', 'poll.user'],
      });
      expect(mockPollOptionRepository.delete).toHaveBeenCalledWith(
        'poll-option-id',
      );
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if poll option is not found', async () => {
      const user: User = { id: 'user-id' } as User;
      mockPollOptionRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.remove('poll-option-id', user),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const user: User = { id: 'user-id-2' } as User;
      const existingPollOption: PollOption = {
        id: 'poll-option-id',
        title: 'Test Poll Option',
        poll: {id: 'poll-id', user: {id: 'user-id'}},
      } as PollOption;
      mockPollOptionRepository.findOneOrFail.mockResolvedValue(
        existingPollOption,
      );

      await expect(
        service.remove('poll-option-id', user),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
