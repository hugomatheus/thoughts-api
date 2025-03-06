type FollowerConstructorProps = {
  followerId: string;
  followingId: string;
  createdAt?: Date;
};

type FollowerCreateCommand = {
  followerId: string;
  followingId: string;
};

export class Follower {
  followerId: string;
  followingId: string;
  createdAt: Date;

  constructor(props: FollowerConstructorProps) {
    this.followerId = props.followerId;
    this.followingId = props.followingId;
    this.createdAt = props.createdAt ?? new Date();
  }

  static createFollower(props: FollowerCreateCommand) {
    return new Follower(props);
  }
}
