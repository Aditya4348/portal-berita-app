import puppeteer from 'puppeteer';
import { ScraperError } from '../errors.js';
import type { ScrapeConfig } from '../types.js';
import type { ScraperAdapter } from './ScraperAdapter.js';

export class PuppeteerAdapter implements ScraperAdapter {
  public readonly engine = 'puppeteer' as const;

  public async fetchHtml(url: string, config: ScrapeConfig): Promise<string> {
    const browser = await puppeteer.launch({
      headless: process.env.PUPPETEER_HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(config.userAgent ?? 'PersonalizedNewsScraper/1.0');

      const response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: config.timeoutMs,
      });

      const status = response?.status();

      if (status === 401 || status === 403 || status === 429) {
        throw new ScraperError(`The target site rejected the scraper with HTTP ${status}.`, 502, 'TARGET_BLOCKED');
      }

      if (status === 404) {
        throw new ScraperError('The target page was not found.', 404, 'TARGET_NOT_FOUND');
      }

      if (!response || !response.ok()) {
        throw new ScraperError(`The target returned HTTP ${status ?? 'unknown'}.`, 502, 'TARGET_FETCH_FAILED');
      }

      return await page.content();
    } catch (error: unknown) {
      if (error instanceof ScraperError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new ScraperError('The target page timed out.', 504, 'TARGET_TIMEOUT', { cause: error });
      }

      throw new ScraperError('Unable to render the target page.', 502, 'TARGET_RENDER_FAILED', { cause: error });
    } finally {
      await browser.close();
    }
  }
}
