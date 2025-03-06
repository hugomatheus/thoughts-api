export class NotFoundError extends Error {
  public readonly status: number;
  constructor(message: string) {
    super(message);
    this.status = 404;
    this.name = 'NotFoundError';
  }
}
