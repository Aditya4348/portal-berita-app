import axios, { AxiosError, type AxiosInstance } from 'axios';
import { ScraperError } from './errors.js';
import type { ScrapedArticle } from './types.js';

const laravelClient: AxiosInstance = axios.create({
  baseURL: process.env.LARAVEL_API_BASE_URL ?? 'http://localhost:8000',
  timeout: Number(process.env.LARAVEL_API_TIMEOUT_MS ?? 10000),
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/json',
  },
});

export async function sendArticleToLaravel(article: ScrapedArticle): Promise<void> {
  const token = process.env.LARAVEL_INTERNAL_API_TOKEN;

  try {
    await laravelClient.post('/api/internal/articles/store', article, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (error: unknown) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;

    throw new ScraperError(
      `Laravel API rejected the scraped article${status ? ` with HTTP ${status}` : ''}.`,
      502,
      'LARAVEL_DELIVERY_FAILED',
      { cause: error },
    );
  }
}
