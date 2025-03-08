import axios, { AxiosError } from 'axios';
import { SentimentApiInterface } from '../../domain/sentiment-api.interface';
import { SentimentTypeEnum } from '../../domain/sentiment-type.enum';
import { ExternalError } from '../../../shared/domain/errors/external.error';
import { statusCodeMessages } from '../../../shared/domain/errors/status-code.error';

interface TextProcessingResponse {
  label: 'pos' | 'neutral' | 'neg';
  probability: {
    pos: number;
    neg: number;
    neutral: number;
  };
}
export class TextProcessingApiService implements SentimentApiInterface {
  async getSentimentByContent(content: string): Promise<any> {
    try {
      const response = await axios.post<TextProcessingResponse>(
        'https://text-processing.com/api/sentiment/',
        { text: content },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return this.textProcessingResponse(response.data?.label);
    } catch (error) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status || 500;
      const errorDescription =
        statusCodeMessages[statusCode] || 'Unknown Error';
      throw new ExternalError(
        'Sentiment Analysis error',
        errorDescription,
        statusCode,
      );
    }
  }

  private textProcessingResponse(label: string): SentimentTypeEnum {
    const sentimentMap: Record<string, SentimentTypeEnum> = {
      pos: SentimentTypeEnum.POSITIVE,
      neu: SentimentTypeEnum.NEUTRAL,
      neg: SentimentTypeEnum.NEGATIVE,
    };
    return sentimentMap[label] ?? SentimentTypeEnum.NEUTRAL;
  }
}
