import { BadRequestError } from '../../../shared/domain/errors/bad-request.error';
import { CreateThoughtUseCase } from '../create-thought.use-case';
import { ThoughtRepositoryInterface } from '../../domain/thought.respository.interface';
import { SentimentApiInterface } from '../../../sentiments/domain/sentiment-api.interface';
import { SentimentTypeEnum } from '../../../sentiments/domain/sentiment-type.enum';
import { Thought } from '../../domain/thought.entity';

describe('FollowUserUseCase Unit', () => {
  let useCase: CreateThoughtUseCase;
  let thoughtRepository: jest.Mocked<ThoughtRepositoryInterface>;
  let sentimentApiService: jest.Mocked<SentimentApiInterface>;

  beforeEach(() => {
    thoughtRepository = {
      create: jest.fn(),
      existsById: jest.fn(),
      countToDayByUserId: jest.fn(),
      findPaginate: jest.fn(),
    };

    sentimentApiService = {
      getSentimentByContent: jest.fn(),
    };

    useCase = new CreateThoughtUseCase(thoughtRepository, sentimentApiService);
  });

  it('should throw error limit', async () => {
    thoughtRepository.countToDayByUserId.mockResolvedValueOnce(5);
    const input = { userId: '1', content: 'content' };
    await expect(useCase.execute(input)).rejects.toThrow(
      new BadRequestError('limit of 5 thought per day'),
    );
  });
  it('should create thought', async () => {
    const spyCreate = jest.spyOn(thoughtRepository, 'create');
    thoughtRepository.countToDayByUserId.mockResolvedValueOnce(1);
    const input = { userId: '1', content: 'content' };
    sentimentApiService.getSentimentByContent.mockResolvedValueOnce(
      SentimentTypeEnum.POSITIVE,
    );

    const result = await useCase.execute(input);
    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(result.userId).toBe(input.userId);
    expect(result.content).toBe(input.content);
    expect(result.id).toBeDefined();
    expect(result.referenceThoughtId).toBeNull();
    expect(result.sentiment).toBeDefined();
    expect(result.sentiment?.type).toBe(SentimentTypeEnum.POSITIVE);
  });
  it('should create reThought', async () => {
    const spyCreate = jest.spyOn(thoughtRepository, 'create');
    thoughtRepository.countToDayByUserId.mockResolvedValueOnce(1);
    const input = { userId: '1', content: 'content', referenceThoughtId: '1' };
    sentimentApiService.getSentimentByContent.mockResolvedValueOnce(
      SentimentTypeEnum.POSITIVE,
    );

    const result = await useCase.execute(input);
    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(result.userId).toBe(input.userId);
    expect(result.content).toBe(input.content);
    expect(result.id).toBeDefined();
    expect(result.referenceThoughtId).toBe('1');
    expect(result.sentiment).toBeDefined();
    expect(result.sentiment?.type).toBe(SentimentTypeEnum.POSITIVE);
  });
});
