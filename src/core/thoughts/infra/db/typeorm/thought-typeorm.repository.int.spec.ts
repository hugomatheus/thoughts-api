import { DataSource, Repository } from 'typeorm';
import { ThoughtTypeOrmRepository } from './thought-typeorm.repository';
import { ThoughtEntity } from './thought.entity';
import { UserEntity } from '../../../../users/infra/db/typeorm/user.entity';
import { entities } from '../../../../../database/database-entities';
import { Thought } from '../../../../thoughts/domain/thought.entity';
import { ThoughtMapper } from './thought.mapper';
import { SearchParamsInterface } from '../../../../shared/domain/search.interface';

describe('ThoughtTpeOrmRepository Integration Unit', () => {
  let respository: ThoughtTypeOrmRepository;
  let typeOrmRepository: Repository<ThoughtEntity>;
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: false,
      entities,
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
    userRepository = dataSource.getRepository(UserEntity);
    typeOrmRepository = dataSource.getRepository(ThoughtEntity);
    respository = new ThoughtTypeOrmRepository(typeOrmRepository);
  });

  it('should exists by id', async () => {
    const user = await userRepository.save({
      id: '1',
      name: 'user1',
      createdAt: new Date(),
    });
    const thought = await typeOrmRepository.save({
      id: '1',
      userId: user.id,
      content: 'content',
      createdAt: new Date(),
    });

    await expect(respository.existsById(thought.id)).resolves.toBeTruthy();
  });

  it('should not exists by id', async () => {
    await expect(respository.existsById('1')).resolves.toBeFalsy();
  });

  it('count by day', async () => {
    await expect(respository.countToDayByUserId('1', new Date())).resolves.toBe(
      0,
    );
    const createdAt = new Date();
    const user = await userRepository.save({
      id: '1',
      name: 'user1',
      createdAt: createdAt,
    });
    await typeOrmRepository.save([
      {
        id: '1',
        userId: user.id,
        content: 'content',
        createdAt: createdAt,
      },
      {
        id: '2',
        userId: user.id,
        content: 'content',
        createdAt: createdAt,
      },
    ]);
    await expect(
      respository.countToDayByUserId(user.id, createdAt),
    ).resolves.toBe(2);
  });

  it('should create thought', async () => {
    const spyThoughtMapper = jest.spyOn(ThoughtMapper, 'toEntity');
    const createdAt = new Date();
    const users = await userRepository.save([
      {
        id: '1',
        name: 'user1',
        createdAt: createdAt,
      },
      {
        id: '2',
        name: 'user2',
        createdAt: createdAt,
      },
    ]);

    const thought = Thought.createThought({
      userId: users[0].id,
      content: 'content',
    });

    await respository.create(thought);
    let findThought = await typeOrmRepository.findOneOrFail({
      where: { id: thought.id },
    });
    expect(spyThoughtMapper).toHaveBeenCalledTimes(1);
    expect(findThought.id).toBe(thought.id);
    expect(findThought.content).toBe('content');
    expect(findThought.referenceThoughtId).toBeNull();

    const reThought = Thought.createThought({
      userId: users[1].id,
      content: null,
      referenceThoughtId: thought.id,
    });

    await respository.create(reThought);
    findThought = await typeOrmRepository.findOneOrFail({
      where: { id: reThought.id },
    });
    expect(spyThoughtMapper).toHaveBeenCalledTimes(2);
    expect(findThought.id).toBe(reThought.id);
    expect(findThought.content).toBeNull();
    expect(findThought.referenceThoughtId).toBe(reThought.referenceThoughtId);

    const reThoughtContent = Thought.createThought({
      userId: users[1].id,
      content: 'content 2',
      referenceThoughtId: reThought.id,
    });

    await respository.create(reThoughtContent);
    findThought = await typeOrmRepository.findOneOrFail({
      where: { id: reThoughtContent.id },
    });
    expect(spyThoughtMapper).toHaveBeenCalledTimes(3);
    expect(findThought.id).toBe(reThoughtContent.id);
    expect(findThought.content).toBe('content 2');
    expect(findThought.referenceThoughtId).toBe(reThought.id);
  });

  it('should find paginate thought', async () => {
    const createdAt = new Date();
    const usersWithThoughts = await userRepository.save([
      {
        id: '1',
        name: 'user1',
        createdAt: createdAt,
        thoughts: [
          {
            id: '1',
            content: 'content1',
            createdAt: new Date(createdAt.getTime() + 4000),
          },
          {
            id: '2',
            content: 'content2',
            createdAt,
          },
          {
            id: '3',
            content: 'content3',
            createdAt: new Date(createdAt.getTime() + 8000),
          },
        ],
      },
      {
        id: '2',
        name: 'user2',
        createdAt: createdAt,
      },
    ]);
    let params: SearchParamsInterface = { page: 1 };
    let findThoughts = await respository.findPaginate(params);
    expect(findThoughts.items.length).toBe(3);

    params = { page: 2 };
    findThoughts = await respository.findPaginate(params);
    expect(findThoughts.items.length).toBe(0);

    params = { page: 1, perPage: 1 };
    findThoughts = await respository.findPaginate(params);
    expect(findThoughts.items.length).toBe(1);
    expect(findThoughts.total).toBe(3);

    params = { page: 1, perPage: 1, sort: 'createdAt', sortDir: 'desc' };
    findThoughts = await respository.findPaginate(params);
    expect(findThoughts.items.length).toBe(1);
    expect(findThoughts.items[0].id).toBe('3');
    expect(findThoughts.total).toBe(3);

    params = { page: 1, perPage: 1, sort: 'createdAt', sortDir: 'asc' };
    findThoughts = await respository.findPaginate(params);
    expect(findThoughts.items.length).toBe(1);
    expect(findThoughts.items[0].id).toBe('2');
    expect(findThoughts.total).toBe(3);

    params = { page: 1 };
    findThoughts = await respository.findPaginate(params, { userId: '2' });
    expect(findThoughts.total).toBe(0);

    params = {};
    findThoughts = await respository.findPaginate(params, {
      userId: ['1', '2'],
    });
    expect(findThoughts.total).toBe(3);
    expect(findThoughts.lastPage).toBe(1);
    expect(findThoughts.perPage).toBe(10);
    expect(findThoughts.page).toBe(1);
  });
});
