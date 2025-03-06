export class BadRequestError extends Error {
  public readonly status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
    this.name = 'BadRequestError';
  }
}
