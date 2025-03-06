export interface SentimentApiInterface {
  getSentimentByContent(content: string): Promise<string>;
}
