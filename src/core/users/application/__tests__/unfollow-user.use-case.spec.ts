import { FollowerRepositoryInterface } from '../../../followers/domain/follower.respository.interface';
import { UserRepositoryInterface } from '../../domain/user.respository.interface';
import { BadRequestError } from '../../../shared/domain/errors/bad-request.error';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { UnfollowUserUseCase } from '../unfollow-user.use-case';

describe('UnfollowUserUseCase Unit', () => {
  let useCase: UnfollowUserUseCase;
  let followerRepository: jest.Mocked<FollowerRepositoryInterface>;

  beforeEach(() => {
    followerRepository = {
      countFollowers: jest.fn(),
      countFollowing: jest.fn(),
      follow: jest.fn(),
      unfollow: jest.fn(),
      isFollowing: jest.fn(),
      getFollowingIdsByUser: jest.fn(),
    };

    useCase = new UnfollowUserUseCase(followerRepository);
  });

  it('should unfollow user', async () => {
    const input = { followerId: '1', followingId: '1' };
    const spy = jest.spyOn(followerRepository, 'unfollow');
    await useCase.execute(input);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(input.followerId, input.followingId);
  });
});
