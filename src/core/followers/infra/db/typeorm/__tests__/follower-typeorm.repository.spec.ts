import { Repository } from 'typeorm';
import { FollowerTypeOrmRepository } from '../follower-typeorm.repository';
import { FollowerEntity } from '../follower.entity';

describe('FollowerTypeOrmRepository Unit', () => {
  let followerTypeOrmRepository: FollowerTypeOrmRepository;
  let mockRepository: jest.Mocked<Repository<FollowerEntity>>;

  beforeEach(() => {
    mockRepository = jest.mocked({
      count: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    } as Partial<Repository<FollowerEntity>>) as jest.Mocked<
      Repository<FollowerEntity>
    >;

    followerTypeOrmRepository = new FollowerTypeOrmRepository(mockRepository);
  });

  it('should be defined', () => {
    expect(followerTypeOrmRepository).toBeDefined();
  });

  describe('countFollowers', () => {
    it('should return the correct number of followers', async () => {
      const userId = 'user-1';
      const mockCount = 5;
      mockRepository.count.mockResolvedValue(mockCount);
      const result = await followerTypeOrmRepository.countFollowers(userId);
      expect(result).toBe(mockCount);
    });
  });
});
