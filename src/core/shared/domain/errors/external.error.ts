export class ExternalError extends Error {
  public readonly status: number;
  public readonly error: string;
  constructor(message: string, error: string, status: number = 500) {
    super(message);
    this.status = status;
    this.error = error;
    this.name = 'ExternalError';
  }
}
