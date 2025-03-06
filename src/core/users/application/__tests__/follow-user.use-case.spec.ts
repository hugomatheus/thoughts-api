import { FollowerRepositoryInterface } from '../../../followers/domain/follower.respository.interface';
import { UserRepositoryInterface } from '../../domain/user.respository.interface';
import { BadRequestError } from '../../../shared/domain/errors/bad-request.error';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { FollowUserUseCase } from '../follow-user.use-case';

describe('FollowUserUseCase Unit', () => {
  let followUserUseCase: FollowUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let followerRepository: jest.Mocked<FollowerRepositoryInterface>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      existsById: jest.fn(),
    };

    followerRepository = {
      countFollowers: jest.fn(),
      countFollowing: jest.fn(),
      follow: jest.fn(),
      unfollow: jest.fn(),
      isFollowing: jest.fn(),
      getFollowingIdsByUser: jest.fn(),
    };

    followUserUseCase = new FollowUserUseCase(
      userRepository,
      followerRepository,
    );
  });

  it('should throw error follow yourself', async () => {
    const input = { followerId: '1', followingId: '1' };

    await expect(followUserUseCase.execute(input)).rejects.toThrow(
      new BadRequestError('Cannot follow yourself'),
    );
  });

  it('should throw error follower not exist', async () => {
    const input = { followerId: '1', followingId: '2' };

    userRepository.findById.mockResolvedValueOnce(null);
    userRepository.findById.mockResolvedValueOnce({
      id: '2',
      name: 'User2',
      createdAt: new Date(),
    });

    await expect(followUserUseCase.execute(input)).rejects.toThrow(
      new NotFoundError('follower not found'),
    );
  });

  it('should throw error following not exist', async () => {
    const spyFollow = jest.spyOn(followerRepository, 'follow');
    const input = { followerId: '1', followingId: '2' };

    userRepository.findById.mockResolvedValueOnce({
      id: '1',
      name: 'User1',
      createdAt: new Date(),
    });
    userRepository.findById.mockResolvedValueOnce(null);

    expect(spyFollow).toHaveBeenCalledTimes(0);
    await expect(followUserUseCase.execute(input)).rejects.toThrow(
      new NotFoundError('user to follow not found'),
    );
  });

  it('should follow user', async () => {
    const spyFollow = jest.spyOn(followerRepository, 'follow');
    const input = { followerId: '1', followingId: '2' };

    userRepository.findById.mockResolvedValueOnce({
      id: '1',
      name: 'User1',
      createdAt: new Date(),
    });

    userRepository.findById.mockResolvedValueOnce({
      id: '2',
      name: 'User2',
      createdAt: new Date(),
    });

    await followUserUseCase.execute(input);
    expect(spyFollow).toHaveBeenCalledTimes(1);
    expect(spyFollow).toHaveBeenCalledWith('1', '2');
  });
});
