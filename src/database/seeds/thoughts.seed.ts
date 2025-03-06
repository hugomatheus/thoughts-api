import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ThoughtEntity } from '../../core/thoughts/infra/db/typeorm/thought.entity';
import { SentimentTypeEnum } from '../../core/sentiments/domain/sentiment-type.enum';

export class ThoughtsSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(ThoughtEntity);
    await repository.insert([
      {
        id: '79563a9a-7593-44af-9bf5-5f4f997e910e',
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
      {
        id: uuidv4(),
        content: 'Olá thought',
        userId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        createdAt: new Date(),
        sentiment: {
          type: SentimentTypeEnum.POSITIVE,
        },
      },
    ]);
  }
}
