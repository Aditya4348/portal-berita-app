import axios, { AxiosError } from 'axios';
import { ScraperError } from '../errors.js';
import type { ScrapeConfig } from '../types.js';
import type { ScraperAdapter } from './ScraperAdapter.js';

export class CheerioAdapter implements ScraperAdapter {
  public readonly engine = 'cheerio' as const;

  public async fetchHtml(url: string, config: ScrapeConfig): Promise<string> {
    try {
      const response = await axios.get<string>(url, {
        timeout: config.timeoutMs,
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': config.userAgent,
        },
        maxRedirects: 5,
        responseType: 'text',
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 401 || status === 403 || status === 429) {
          throw new ScraperError(`The target site rejected the scraper with HTTP ${status}.`, 502, 'TARGET_BLOCKED', { cause: error });
        }

        if (status === 404) {
          throw new ScraperError('The target page was not found.', 404, 'TARGET_NOT_FOUND', { cause: error });
        }

        if (error.code === 'ECONNABORTED') {
          throw new ScraperError('The target page timed out.', 504, 'TARGET_TIMEOUT', { cause: error });
        }
      }

      throw new ScraperError('Unable to download the target page.', 502, 'TARGET_FETCH_FAILED', { cause: error });
    }
  }
}
