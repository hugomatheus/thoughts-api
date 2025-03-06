import { Sentiment } from '../../sentiments/domain/sentiment.entity';
import { v4 as uuidv4 } from 'uuid';

type ThoughtConstructorProps = {
  id?: string;
  userId: string;
  content?: string | null;
  referenceThoughtId?: string | null;
  createdAt?: Date;
  sentiment?: Sentiment | null;
};

type ThoughtCreateCommand = {
  userId: string;
  content?: string | null;
  referenceThoughtId?: string | null;
};

export class Thought {
  id: string;
  userId: string;
  content: string | null;
  referenceThoughtId: string | null;
  createdAt: Date;
  sentiment?: Sentiment;

  constructor(props: ThoughtConstructorProps) {
    this.id = props.id ?? uuidv4();
    this.userId = props.userId;
    this.content = props.content ?? null;
    this.referenceThoughtId = props.referenceThoughtId ?? null;
    this.createdAt = props.createdAt ?? new Date();
    if (props.sentiment) {
      this.sentiment = props.sentiment;
    }
  }

  static createThought(props: ThoughtCreateCommand) {
    return new Thought(props);
  }
}
