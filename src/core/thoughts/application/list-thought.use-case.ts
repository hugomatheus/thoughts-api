import { FollowerRepositoryInterface } from '../../followers/domain/follower.respository.interface';
import {
  ThoughtPaginateResult,
  ThoughtRepositoryInterface,
} from '../domain/thought.respository.interface';

type ListThoughtInput = {
  userId: string;
  paginate?: {
    page?: number;
  };
  filters?: {
    following?: boolean;
  };
};

export class ListThoughtUseCase {
  constructor(
    private thoughtRepository: ThoughtRepositoryInterface,
    private followerRepository: FollowerRepositoryInterface,
  ) {}

  async execute(input: ListThoughtInput): Promise<ThoughtPaginateResult> {
    let followingsIds: string[] = [];
    if (input.filters?.following) {
      followingsIds = await this.followerRepository.getFollowingIdsByUser(
        input.userId,
      );
    }
    return await this.thoughtRepository.findPaginate(
      { ...input?.paginate },
      { userId: followingsIds },
    );
  }
}
