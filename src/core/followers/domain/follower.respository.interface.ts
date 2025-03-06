export interface FollowerRepositoryInterface {
  countFollowers(userId: string): Promise<number>;
  countFollowing(userId: string): Promise<number>;
  follow(followerId: string, followingId: string): Promise<void>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowingIdsByUser(followerId: string): Promise<string[]>;
}
