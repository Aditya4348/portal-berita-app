export type ScraperEngine = 'cheerio' | 'puppeteer';

export interface ArticleSelectors {
  title?: string;
  content?: string;
  image?: string;
  publishedAt?: string;
}

export interface ScrapeConfig {
  engine?: ScraperEngine;
  selectors?: ArticleSelectors;
  timeoutMs?: number;
  userAgent?: string;
  forwardToLaravel?: boolean;
}

export interface ScrapedArticle {
  title: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string | null;
  originalUrl: string;
  scrapedAt: string;
  engine: ScraperEngine;
}
