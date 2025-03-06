import { UserEntity } from '../core/users/infra/db/typeorm/user.entity';
import { SentimentEntity } from '../core/sentiments/infra/db/typeorm/sentiment.entity';
import { ThoughtEntity } from '../core/thoughts/infra/db/typeorm/thought.entity';
import { FollowerEntity } from '../core/followers/infra/db/typeorm/follower.entity';

export const entities = [
  ThoughtEntity,
  SentimentEntity,
  UserEntity,
  FollowerEntity,
];
