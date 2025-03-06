import { FollowerRepositoryInterface } from '../../followers/domain/follower.respository.interface';
import { UserRepositoryInterface } from '../domain/user.respository.interface';
import { BadRequestError } from '../../shared/domain/errors/bad-request.error';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';

type FollowUserInput = {
  followerId: string;
  followingId: string;
};

export class FollowUserUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private followerRepository: FollowerRepositoryInterface,
  ) {}

  async execute(input: FollowUserInput): Promise<void> {
    if (input.followerId === input.followingId) {
      throw new BadRequestError('Cannot follow yourself');
    }

    const [follower, following] = await Promise.all([
      this.userRepository.findById(input.followerId),
      this.userRepository.findById(input.followingId),
    ]);

    if (!follower) {
      throw new NotFoundError('follower not found');
    }
    if (!following) {
      throw new NotFoundError('user to follow not found');
    }
    await this.followerRepository.follow(input.followerId, input.followingId);
  }
}
