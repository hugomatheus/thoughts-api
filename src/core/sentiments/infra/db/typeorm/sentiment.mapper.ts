import { Sentiment } from '../../../domain/sentiment.entity';
import { SentimentEntity } from './sentiment.entity';

export class SentimentMapper {
  static toDomain(entity: SentimentEntity): Sentiment {
    return new Sentiment({
      id: entity.id ?? null,
      type: entity.type,
      thoughtId: entity.thoughtId,
    });
  }

  static toEntity(domain: Sentiment): SentimentEntity {
    const entity = new SentimentEntity();
    entity.id = domain.id;
    entity.type = domain.type;
    entity.thoughtId = domain.thoughtId;
    return entity;
  }
}
