import { Repository } from 'typeorm';
import { SentimentMapper } from './sentiment.mapper';
import { SentimentRepositoryInterface } from '../../../domain/sentiment.respository.interface';
import { SentimentEntity } from './sentiment.entity';
import { Sentiment } from '../../../domain/sentiment.entity';

export class SentimentTypeOrmRepository
  implements SentimentRepositoryInterface
{
  constructor(private sentimentRepository: Repository<SentimentEntity>) {}

  async create(sentiment: Sentiment): Promise<void> {
    const entity = SentimentMapper.toEntity(sentiment);
    await this.sentimentRepository.save(entity);
  }
}
