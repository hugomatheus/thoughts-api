import { DataSource, Repository } from 'typeorm';
import { SentimentTypeOrmRepository } from '../sentiment-typeorm.repository';
import { SentimentEntity } from '../sentiment.entity';
import { entities } from '../../../../../../database/database-entities';
import { Sentiment } from '../../../../../sentiments/domain/sentiment.entity';
import { ThoughtEntity } from '../../../../../thoughts/infra/db/typeorm/thought.entity';
import { SentimentTypeEnum } from '../../../../../sentiments/domain/sentiment-type.enum';
import { UserEntity } from '../../../../../users/infra/db/typeorm/user.entity';
import { SentimentMapper } from '../sentiment.mapper';

describe('SentimentTypeOrmRepository Integration Unit', () => {
  let sentimentRepository: SentimentTypeOrmRepository;
  let typeOrmRepositorySentiment: Repository<SentimentEntity>;
  let typeOrmRepositoryTought: Repository<ThoughtEntity>;
  let typeOrmRepositoryUser: Repository<UserEntity>;
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

    typeOrmRepositoryTought = dataSource.getRepository(ThoughtEntity);
    typeOrmRepositorySentiment = dataSource.getRepository(SentimentEntity);
    typeOrmRepositoryUser = dataSource.getRepository(UserEntity);
    sentimentRepository = new SentimentTypeOrmRepository(
      typeOrmRepositorySentiment,
    );
  });

  it('should create sentiment', async () => {
    const spySentimentMapper = jest.spyOn(SentimentMapper, 'toEntity');
    const user = await typeOrmRepositoryUser.save({
      id: '1',
      name: 'name',
      createdAt: new Date(),
      thoughts: [
        {
          id: '1',
          content: 'content',
          createdAt: new Date(),
        },
      ],
    });
    const sentiment = Sentiment.createSentiment({
      thoughtId: user.thoughts[0].id,
      type: SentimentTypeEnum.NEUTRAL,
    });

    await sentimentRepository.create(sentiment);
    const findSentimentTypeOrm = await typeOrmRepositorySentiment.findOneOrFail(
      {
        where: { id: sentiment.id },
      },
    );
    expect(spySentimentMapper).toHaveBeenCalledTimes(1);
    expect(findSentimentTypeOrm.thoughtId).toBe(user.thoughts[0].id);
    expect(findSentimentTypeOrm.type).toBe(SentimentTypeEnum.NEUTRAL);
    expect(findSentimentTypeOrm.id).toBe(sentiment.id);
  });
});
