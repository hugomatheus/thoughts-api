import { Sentiment } from './sentiment.entity';

export interface SentimentRepositoryInterface {
  create(entity: Sentiment): Promise<void>;
}
