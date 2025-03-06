import { v4 as uuidv4 } from 'uuid';
import { SentimentTypeEnum } from './sentiment-type.enum';

type SentimentConstructorProps = {
  id?: string;
  thoughtId: string;
  type: SentimentTypeEnum;
};

type SentimentCreateCommand = {
  thoughtId: string;
  type: SentimentTypeEnum;
};

export class Sentiment {
  id: string;
  thoughtId: string;
  type: SentimentTypeEnum;

  constructor(props: SentimentConstructorProps) {
    this.id = props.id ?? uuidv4();
    this.thoughtId = props.thoughtId;
    this.type = props.type;
  }

  static createSentiment(props: SentimentCreateCommand) {
    return new Sentiment(props);
  }
}
