import { FollowerEntity } from '../../../../followers/infra/db/typeorm/follower.entity';
import { ThoughtEntity } from '../../../../thoughts/infra/db/typeorm/thought.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 14 })
  name: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ThoughtEntity, (thought) => thought.user, { cascade: true })
  thoughts?: ThoughtEntity[];

  @OneToMany(() => FollowerEntity, (following) => following.follower)
  followings?: FollowerEntity[];
}
