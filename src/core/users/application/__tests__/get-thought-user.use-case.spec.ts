import { UserRepositoryInterface } from '../../domain/user.respository.interface';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { GetThoughtUserUseCase } from '../get-thought-user.use-case';
import {
  ThoughtPaginateResult,
  ThoughtRepositoryInterface,
} from '../../../thoughts/domain/thought.respository.interface';
import { User } from '../../domain/user.entity';

describe('GetThoughtUserUseCase Unit', () => {
  let useCase: GetThoughtUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let thoughtRepository: jest.Mocked<ThoughtRepositoryInterface>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      existsById: jest.fn(),
    };

    thoughtRepository = {
      create: jest.fn(),
      existsById: jest.fn(),
      countToDayByUserId: jest.fn(),
      findPaginate: jest.fn(),
    };

    useCase = new GetThoughtUserUseCase(userRepository, thoughtRepository);
  });

  it('should throw error: user not found', async () => {
    const input = { userId: '1' };
    userRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      new NotFoundError('user not found'),
    );
  });
  it('should get thoughts', async () => {
    const spyFindPaginate = jest.spyOn(thoughtRepository, 'findPaginate');
    const spyUserFindById = jest.spyOn(userRepository, 'findById');
    const input = { userId: '1', page: 1 };
    const user = User.createUser({
      name: 'name',
    });

    const mockThoughtsPaginate: ThoughtPaginateResult = {
      items: [],
      page: 1,
      lastPage: 1,
      perPage: 5,
      total: 0,
    };
    userRepository.findById.mockResolvedValueOnce(user);
    thoughtRepository.findPaginate.mockResolvedValueOnce(mockThoughtsPaginate);
    const result = await useCase.execute(input);
    expect(spyFindPaginate).toHaveBeenCalledTimes(1);
    expect(spyFindPaginate).toHaveBeenCalledWith(
      { page: 1, perPage: 5 },
      { userId: input.userId },
    );
    expect(spyUserFindById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockThoughtsPaginate);
  });
});
