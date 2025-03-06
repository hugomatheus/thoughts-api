import { Thought } from '../../../domain/thought.entity';
import { ThoughtEntity } from './thought.entity';
import { Sentiment } from '../../../../sentiments/domain/sentiment.entity';

export class ThoughtMapper {
  static toDomain(entity: ThoughtEntity): Thought {
    return new Thought({
      id: entity.id ?? null,
      userId: entity.userId,
      content: entity.content ?? null,
      referenceThoughtId: entity.referenceThoughtId ?? null,
      createdAt: entity.createdAt,
      sentiment: entity.sentiment
        ? new Sentiment({
            id: entity.sentiment.id,
            type: entity.sentiment.type,
            thoughtId: entity.sentiment.thoughtId,
          })
        : null,
    });
  }

  static toEntity(domain: Thought): ThoughtEntity {
    return Object.assign(new ThoughtEntity(), domain);
  }
}
