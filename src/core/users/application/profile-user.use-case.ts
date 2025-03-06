import { FollowerRepositoryInterface } from '../../followers/domain/follower.respository.interface';
import { UserRepositoryInterface } from '../domain/user.respository.interface';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';
import { CacheService } from '../../shared/services/cache.service';
import { CACHE_PROFILE_USER_KEY_PREFIX } from '../../../config/contants/contants';

type ProfileUserInput = {
  currentUserId: string;
  profileUserId: string;
};

type ProfileUserOutput = {
  name: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
};

export class ProfileUserUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private followerRepository: FollowerRepositoryInterface,
    private cacheService: CacheService,
  ) {}

  async execute(input: ProfileUserInput): Promise<ProfileUserOutput> {
    const cacheProfileUserKey = `${CACHE_PROFILE_USER_KEY_PREFIX}-${input.profileUserId}`;
    let userProfile =
      await this.cacheService.getCache<Omit<ProfileUserOutput, 'isFollowing'>>(
        cacheProfileUserKey,
      );

    if (!userProfile) {
      const user = await this.userRepository.findById(input.profileUserId);
      if (!user) {
        throw new NotFoundError('user not found');
      }

      const [followersCount, followingCount] = await Promise.all([
        this.followerRepository.countFollowers(input.profileUserId),
        this.followerRepository.countFollowing(input.profileUserId),
      ]);

      userProfile = {
        name: user.name,
        createdAt: user.createdAt.toLocaleDateString('pt-BR'),
        followersCount,
        followingCount,
      };

      await this.cacheService.setCache<Omit<ProfileUserOutput, 'isFollowing'>>(
        cacheProfileUserKey,
        userProfile,
        100000,
      );
    }

    const isFollowing = await this.followerRepository.isFollowing(
      input.currentUserId,
      input.profileUserId,
    );

    return {
      ...userProfile,
      isFollowing,
    };
  }
}
