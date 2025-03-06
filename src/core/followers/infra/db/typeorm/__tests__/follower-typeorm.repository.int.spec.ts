import { DataSource, Repository } from 'typeorm';
import { FollowerEntity } from '../follower.entity';
import { FollowerTypeOrmRepository } from '../follower-typeorm.repository';
import { UserEntity } from '../../../../../users/infra/db/typeorm/user.entity';
import { BadRequestError } from '../../../../../shared/domain/errors/bad-request.error';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { entities } from '../../../../../../database/database-entities';

describe('FollowerTypeOrmRepository Integration Unit', () => {
  let repository: FollowerTypeOrmRepository;
  let typeOrmRepository: Repository<FollowerEntity>;
  let userRepository: Repository<UserEntity>;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: false,
      entities: entities,
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);

    typeOrmRepository = dataSource.getRepository(FollowerEntity);
    userRepository = dataSource.getRepository(UserEntity);
    repository = new FollowerTypeOrmRepository(typeOrmRepository);
  });

  it('should return the correct number of followers', async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
      { id: '3', name: 'user3', createdAt: new Date() },
    ]);

    await typeOrmRepository.insert([
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[2].id, followingId: users[1].id },
    ]);

    let count = await repository.countFollowers(users[1].id);
    expect(count).toBe(2);

    count = await repository.countFollowers(users[0].id);
    expect(count).toBe(0);
  });
  it('should return the correct number of followings', async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
      { id: '3', name: 'user3', createdAt: new Date() },
    ]);

    await typeOrmRepository.insert([
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
    ]);

    let count = await repository.countFollowing(users[0].id);
    expect(count).toBe(2);

    count = await repository.countFollowing(users[2].id);
    expect(count).toBe(0);
  });

  it('should follow user', async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
    ]);

    await repository.follow(users[0].id, users[1].id);
    await expect(
      repository.isFollowing(users[0].id, users[1].id),
    ).resolves.toBeTruthy();
  });

  it("should can't follow this person again", async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
    ]);

    await repository.follow(users[0].id, users[1].id);
    await expect(repository.follow(users[0].id, users[1].id)).rejects.toThrow(
      new BadRequestError("you can't follow this person again"),
    );
  });

  it('should unfollow user', async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
    ]);

    await repository.follow(users[0].id, users[1].id);
    await repository.unfollow(users[0].id, users[1].id);
    await expect(
      repository.isFollowing(users[0].id, users[1].id),
    ).resolves.toBeFalsy();
  });
  it('should throw error unfollow user', async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
    ]);

    await expect(repository.unfollow(users[0].id, users[1].id)).rejects.toThrow(
      new NotFoundError('unfollow error'),
    );
  });

  it('should get followings by user id', async () => {
    const users = await userRepository.save([
      { id: '1', name: 'user1', createdAt: new Date() },
      { id: '2', name: 'user2', createdAt: new Date() },
      { id: '3', name: 'user3', createdAt: new Date() },
    ]);

    await typeOrmRepository.insert([
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
    ]);

    let result = await repository.getFollowingIdsByUser('1');
    expect(result).toStrictEqual([users[1].id, users[2].id]);

    result = await repository.getFollowingIdsByUser('2');
    expect(result).toStrictEqual([]);
  });
});
