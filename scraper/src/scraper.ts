import * as cheerio from 'cheerio';
import { CheerioAdapter } from './adapters/CheerioAdapter.js';
import { PuppeteerAdapter } from './adapters/PuppeteerAdapter.js';
import type { ScraperAdapter } from './adapters/ScraperAdapter.js';
import { ScraperError } from './errors.js';
import type { ScrapeConfig, ScrapedArticle, ScraperEngine } from './types.js';

const adapters: Record<ScraperEngine, ScraperAdapter> = {
  cheerio: new CheerioAdapter(),
  puppeteer: new PuppeteerAdapter(),
};

const firstValue = (...values: Array<string | undefined>): string | null => {
  for (const value of values) {
    const normalized = value?.replace(/\s+/g, ' ').trim();

    if (normalized) {
      return normalized;
    }
  }

  return null;
};

const absoluteUrl = (value: string | null, baseUrl: string): string | null => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
};

const normalizeDate = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const validateUrl = (url: string): string => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new ScraperError('A valid URL is required.', 400, 'INVALID_URL');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new ScraperError('Only HTTP and HTTPS URLs are supported.', 400, 'INVALID_URL_PROTOCOL');
  }

  return parsedUrl.toString();
};

export async function scrapeArticle(url: string, config: ScrapeConfig = {}): Promise<ScrapedArticle> {
  const originalUrl = validateUrl(url);
  const engine = config.engine ?? (process.env.DEFAULT_SCRAPER_ENGINE as ScraperEngine | undefined) ?? 'cheerio';
  const adapter = adapters[engine];

  if (!adapter) {
    throw new ScraperError(`Unsupported scraper engine: ${engine}.`, 400, 'INVALID_ENGINE');
  }

  const resolvedConfig: ScrapeConfig = {
    ...config,
    timeoutMs: config.timeoutMs ?? Number(process.env.SCRAPER_TIMEOUT_MS ?? 30000),
    userAgent: config.userAgent ?? process.env.SCRAPER_USER_AGENT ?? 'PersonalizedNewsScraper/1.0',
  };
  const html = await adapter.fetchHtml(originalUrl, resolvedConfig);
  const $ = cheerio.load(html);

  $('script, style, noscript, iframe, svg, form, nav, footer, aside').remove();

  const title = firstValue(
    config.selectors?.title ? $(config.selectors.title).first().text() : undefined,
    $('meta[property="og:title"]').attr('content'),
    $('meta[name="twitter:title"]').attr('content'),
    $('h1').first().text(),
    $('title').text(),
  );
  const contentNode = config.selectors?.content
    ? $(config.selectors.content).first()
    : $('article, main, [role="main"], .article-body, .article-content, .post-content').first();
  const fallbackContentNode = contentNode.length > 0 ? contentNode : $('body');
  const content = fallbackContentNode.text().replace(/\s+/g, ' ').trim();
  const imageValue = firstValue(
    config.selectors?.image ? $(config.selectors.image).first().attr('src') : undefined,
    $('meta[property="og:image"]').attr('content'),
    $('meta[name="twitter:image"]').attr('content'),
    fallbackContentNode.find('img').first().attr('src'),
  );
  const publishedValue = firstValue(
    config.selectors?.publishedAt
      ? $(config.selectors.publishedAt).first().attr('datetime') ?? $(config.selectors.publishedAt).first().text()
      : undefined,
    $('meta[property="article:published_time"]').attr('content'),
    $('meta[name="date"]').attr('content'),
    $('time[datetime]').first().attr('datetime'),
  );

  if (!title || !content) {
    throw new ScraperError('The page was fetched but no article content could be extracted.', 422, 'CONTENT_NOT_FOUND');
  }

  return {
    title,
    content,
    imageUrl: absoluteUrl(imageValue, originalUrl),
    publishedAt: normalizeDate(publishedValue),
    originalUrl,
    scrapedAt: new Date().toISOString(),
    engine,
  };
}
