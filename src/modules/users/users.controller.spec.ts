import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { FollowUserUseCase } from '../../core/users/application/follow-user.use-case';
import { ProfileUserUseCase } from '../../core/users/application/profile-user.use-case';
import { GetThoughtUserUseCase } from '../../core/users/application/get-thought-user.use-case';
import { UnfollowUserUseCase } from '../../core/users/application/unfollow-user.use-case';
import { FollowDto } from './dto/follow.dto';
import { CheckUserIdExistPipe } from '../shared/pipes/check-user-id-existis.pipe';

// Mocking the use cases
const mockFollowUserUseCase = { execute: jest.fn() };
const mockProfileUserUseCase = { execute: jest.fn() };
const mockGetThoughtUserUseCase = { execute: jest.fn() };
const mockUnfollowUserUseCase = { execute: jest.fn() };
const mockUserRepositoryInterface = { execute: jest.fn() };

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CheckUserIdExistPipe,
        {
          provide: 'UserRepositoryInterface',
          useValue: mockUserRepositoryInterface,
        },
        { provide: FollowUserUseCase, useValue: mockFollowUserUseCase },
        { provide: ProfileUserUseCase, useValue: mockProfileUserUseCase },
        { provide: GetThoughtUserUseCase, useValue: mockGetThoughtUserUseCase },
        { provide: UnfollowUserUseCase, useValue: mockUnfollowUserUseCase },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile user data', async () => {
      const currentUserId = 'user-1';
      const profileUserId = 'user-2';
      const mockResponse = { data: 'profile data' };

      mockProfileUserUseCase.execute.mockResolvedValue(mockResponse);

      const result = await controller.getProfile(currentUserId, profileUserId);
      expect(result).toBe(mockResponse);
      expect(mockProfileUserUseCase.execute).toHaveBeenCalledWith({
        currentUserId,
        profileUserId,
      });
    });
  });

  describe('getThoughts', () => {
    it('should return user thoughts', async () => {
      const userId = 'user-1';
      const page = 1;
      const mock = {
        items: [{ id: '1', content: 'content', createdAt: new Date() }],
        page: 1,
        perPage: 10,
        total: 1,
        lastPage: 1,
      };

      mockGetThoughtUserUseCase.execute.mockResolvedValue(mock);

      const result = await controller.getThoughts(userId, page);
      expect(result).toBe(mock);
      expect(mockGetThoughtUserUseCase.execute).toHaveBeenCalledWith({
        userId,
        page,
      });
    });
  });

  describe('follow', () => {
    it('should call followUserUseCase.execute with valid data', async () => {
      const followDto: FollowDto = {
        followerId: '1',
        followingId: '2',
      };
      await controller.follow(followDto);

      expect(mockFollowUserUseCase.execute).toHaveBeenCalledWith(followDto);
    });
  });

  describe('unfollow', () => {
    it('should call unfollowUserUseCase.execute with valid data', async () => {
      const followerId = '1';
      const followingId = '2';
      await controller.unfollow(followerId, followingId);

      expect(mockUnfollowUserUseCase.execute).toHaveBeenCalledWith({
        followerId,
        followingId,
      });
    });
  });
});
