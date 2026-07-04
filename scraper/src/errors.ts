export class ScraperError extends Error {
  public constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'SCRAPE_FAILED',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ScraperError';
  }
}
