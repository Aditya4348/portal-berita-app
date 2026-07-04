import type { ScrapeConfig, ScraperEngine } from '../types.js';

export interface ScraperAdapter {
  readonly engine: ScraperEngine;
  fetchHtml(url: string, config: ScrapeConfig): Promise<string>;
}
