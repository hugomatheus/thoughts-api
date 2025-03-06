import { FollowerRepositoryInterface } from '../../followers/domain/follower.respository.interface';

type UnfollowUserInput = {
  followerId: string;
  followingId: string;
};

export class UnfollowUserUseCase {
  constructor(private followerRepository: FollowerRepositoryInterface) {}

  async execute(input: UnfollowUserInput): Promise<void> {
    await this.followerRepository.unfollow(input.followerId, input.followingId);
  }
}
