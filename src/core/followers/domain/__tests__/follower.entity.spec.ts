import { Follower } from '../follower.entity';

describe('Follower Unit', () => {
  it('create domain follower', () => {
    const follower = new Follower({ followerId: '1', followingId: '2' });

    expect(follower).toBeDefined();
    expect(follower.followerId).toBe('1');
    expect(follower.followingId).toBe('2');
  });

  it('create domain by createFollower', () => {
    const follower = Follower.createFollower({
      followerId: '1',
      followingId: '2',
    });

    expect(follower).toBeInstanceOf(Follower);
    expect(follower.followerId).toBe('1');
    expect(follower.followingId).toBe('2');
  });
});
