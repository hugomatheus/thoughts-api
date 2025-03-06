import { UserRepositoryInterface } from '../domain/user.respository.interface';
import {
  ThoughtPaginateResult,
  ThoughtRepositoryInterface,
} from '../../thoughts/domain/thought.respository.interface';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';
import { SearchParamsInterface } from '../../shared/domain/search.interface';

type GetThoughtUserInput = {
  userId: string;
  page?: number;
};

export class GetThoughtUserUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private thoughtRepository: ThoughtRepositoryInterface,
  ) {}

  async execute(input: GetThoughtUserInput): Promise<ThoughtPaginateResult> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError('user not found');
    }
    const propsSearch: SearchParamsInterface = { page: input.page, perPage: 5 };
    return await this.thoughtRepository.findPaginate(propsSearch, {
      userId: input.userId,
    });
  }
}
