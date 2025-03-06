import { UserEntity } from '../../../../users/infra/db/typeorm/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'followers' })
@Unique(['followerId', 'followingId'])
export class FollowerEntity {
  @PrimaryColumn({ name: 'follower_id' })
  followerId: string;

  @PrimaryColumn({ name: 'following_id' })
  followingId: string;

  @ManyToOne(() => UserEntity, (user) => user.followings)
  @JoinColumn({ name: 'follower_id' })
  follower?: UserEntity;
}
