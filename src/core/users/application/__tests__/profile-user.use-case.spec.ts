import { UserRepositoryInterface } from '../../domain/user.respository.interface';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { ProfileUserUseCase } from '../profile-user.use-case';
import { CacheService } from '../../../shared/services/cache.service';
import { FollowerRepositoryInterface } from '../../../followers/domain/follower.respository.interface';
import { Cache } from 'cache-manager';
import { User } from '../../domain/user.entity';

const mockInput = {
  currentUserId: '1',
  profileUserId: '2',
};
describe('ProfileUserUseCase Unit', () => {
  let useCase: ProfileUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let followerRepository: jest.Mocked<FollowerRepositoryInterface>;
  let cacheManager: jest.Mocked<Cache>;
  let cacheService: jest.Mocked<CacheService>;

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

    cacheManager = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<Cache>;

    cacheService = new CacheService(cacheManager) as jest.Mocked<CacheService>;
    cacheService.setCache = jest.fn();
    cacheService.getCache = jest.fn();
    cacheService.removeCache = jest.fn();

    useCase = new ProfileUserUseCase(
      userRepository,
      followerRepository,
      cacheService,
    );
  });

  it('should exist cache profile and following', async () => {
    const spyUser = jest.spyOn(userRepository, 'findById');
    const spySetCach = jest.spyOn(cacheService, 'setCache');
    const mockCache = {
      name: 'name',
      createdAt: '01/01/2025',
      followersCount: 1,
      followingCount: 1,
    };
    cacheService.getCache.mockResolvedValueOnce(mockCache);
    followerRepository.isFollowing.mockResolvedValueOnce(false);
    await expect(useCase.execute(mockInput)).resolves.toEqual({
      ...mockCache,
      isFollowing: false,
    });
    expect(spyUser).toHaveBeenCalledTimes(0);
    expect(spySetCach).toHaveBeenCalledTimes(0);
  });
  it('should throw not found user', async () => {
    cacheService.getCache.mockResolvedValueOnce(null);
    userRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute(mockInput)).rejects.toThrow(
      new NotFoundError('user not found'),
    );
  });
  it('should profile user', async () => {
    const spyCache = jest.spyOn(cacheService, 'setCache');
    cacheService.getCache.mockResolvedValueOnce(null);
    const user = User.createUser({ name: 'name' });
    userRepository.findById.mockResolvedValueOnce(user);
    followerRepository.countFollowers.mockResolvedValueOnce(1);
    followerRepository.countFollowing.mockResolvedValueOnce(1);
    followerRepository.isFollowing.mockResolvedValueOnce(false);
    await expect(useCase.execute(mockInput)).resolves.toEqual({
      name: user.name,
      createdAt: user.createdAt.toLocaleDateString('pt-BR'),
      followersCount: 1,
      followingCount: 1,
      isFollowing: false,
    });
    expect(spyCache).toHaveBeenCalledTimes(1);
  });
});
