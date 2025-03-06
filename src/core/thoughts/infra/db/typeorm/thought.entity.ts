import { UserEntity } from '../../../../users/infra/db/typeorm/user.entity';
import { SentimentEntity } from '../../../../sentiments/infra/db/typeorm/sentiment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'thoughts' })
export class ThoughtEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'reference_thought_id', nullable: true })
  referenceThoughtId: string | null;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  content: string | null;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.thoughts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ManyToOne(() => ThoughtEntity, (thought) => thought.reThoughts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reference_thought_id' })
  referenceThought?: ThoughtEntity | null;

  @OneToMany(() => ThoughtEntity, (thought) => thought.referenceThought)
  reThoughts?: ThoughtEntity[];

  @OneToOne(() => SentimentEntity, (sentiment) => sentiment.thougth, {
    cascade: true,
  })
  sentiment?: SentimentEntity;
}
