import { SentimentTypeEnum } from '../../../../sentiments/domain/sentiment-type.enum';
import { ThoughtEntity } from '../../../../thoughts/infra/db/typeorm/thought.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'thoughts_sentiments' })
export class SentimentEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'thought_id' })
  thoughtId: string;

  @Column({ name: 'type' })
  type: SentimentTypeEnum;

  @OneToOne(() => ThoughtEntity)
  @JoinColumn({ name: 'thought_id' })
  thougth?: ThoughtEntity;
}
