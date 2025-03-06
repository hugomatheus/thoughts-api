import { Repository } from 'typeorm';
import { FollowerEntity } from './follower.entity';
import { FollowerRepositoryInterface } from '../../../domain/follower.respository.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { BadRequestError } from '../../../../shared/domain/errors/bad-request.error';

export class FollowerTypeOrmRepository implements FollowerRepositoryInterface {
  constructor(private followerRepository: Repository<FollowerEntity>) {}

  async countFollowers(userId: string): Promise<number> {
    return await this.followerRepository.count({
      where: { followingId: userId },
    });
  }

  async countFollowing(userId: string): Promise<number> {
    return await this.followerRepository.count({
      where: { followerId: userId },
    });
  }

  async follow(followerId: string, followingId: string): Promise<void> {
    const isFollowing = await this.isFollowing(followerId, followingId);

    if (isFollowing) {
      throw new BadRequestError("you can't follow this person again");
    }

    await this.followerRepository.insert({ followerId, followingId });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const result = await this.followerRepository.delete({
      followerId,
      followingId,
    });
    if (!result.affected) {
      throw new NotFoundError('unfollow error');
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return await this.followerRepository.exists({
      where: { followerId, followingId },
    });
  }

  async getFollowingIdsByUser(followerId: string): Promise<string[]> {
    const followings = await this.followerRepository.find({
      where: { followerId },
      select: ['followingId'],
    });
    return followings.map((following) => following.followingId);
  }
}
