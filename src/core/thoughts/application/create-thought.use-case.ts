import { Sentiment } from '../../sentiments/domain/sentiment.entity';
import { SentimentApiInterface } from '../../sentiments/domain/sentiment-api.interface';
import { Thought } from '../domain/thought.entity';
import { ThoughtRepositoryInterface } from '../domain/thought.respository.interface';
import { SentimentTypeEnum } from '../../../core/sentiments/domain/sentiment-type.enum';
import { BadRequestError } from '../../../core/shared/domain/errors/bad-request.error';

type CreateThoughtInput = {
  userId: string;
  content?: string | null;
  referenceThoughtId?: string | null;
};

type CreateThoughtOutput = {
  id: string;
  userId: string;
  content: string | null;
  referenceThoughtId: string | null;
  sentiment: { type: string } | null;
};

export class CreateThoughtUseCase {
  constructor(
    private thoughtRepository: ThoughtRepositoryInterface,
    private sentimentApiService: SentimentApiInterface,
  ) {}

  async execute(input: CreateThoughtInput): Promise<CreateThoughtOutput> {
    const thoughtCountToDay = await this.thoughtRepository.countToDayByUserId(
      input.userId,
      new Date(),
    );
    const limitToday = 5;
    if (thoughtCountToDay >= limitToday) {
      throw new BadRequestError(`limit of ${limitToday} thought per day`);
    }

    let sentimentAnalyze: SentimentTypeEnum = '' as SentimentTypeEnum;
    if (input.content) {
      sentimentAnalyze = (await this.sentimentApiService.getSentimentByContent(
        input.content,
      )) as SentimentTypeEnum;
    }
    const thought = Thought.createThought(input);
    if (sentimentAnalyze) {
      const sentiment = Sentiment.createSentiment({
        type: sentimentAnalyze,
        thoughtId: thought.id,
      });
      thought.sentiment = sentiment;
    }
    await this.thoughtRepository.create(thought);
    return {
      id: thought.id,
      userId: thought.userId,
      content: thought.content,
      referenceThoughtId: thought.referenceThoughtId,
      sentiment: thought.sentiment ? { type: thought.sentiment.type } : null,
    };
  }
}
