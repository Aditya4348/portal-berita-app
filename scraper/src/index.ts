import 'dotenv/config';
import Fastify from 'fastify';
import { ScraperError } from './errors.js';
import { sendArticleToLaravel } from './laravelClient.js';
import { scrapeArticle } from './scraper.js';
import type { ScrapeConfig } from './types.js';

interface ScrapeRequestBody {
  url: string;
  config?: ScrapeConfig;
}

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});

server.post<{ Body: ScrapeRequestBody }>('/scrape', {
  schema: {
    body: {
      type: 'object',
      additionalProperties: false,
      required: ['url'],
      properties: {
        url: { type: 'string', format: 'uri' },
        config: {
          type: 'object',
          additionalProperties: false,
          properties: {
            engine: { type: 'string', enum: ['cheerio', 'puppeteer'] },
            timeoutMs: { type: 'integer', minimum: 1000, maximum: 120000 },
            userAgent: { type: 'string', minLength: 1, maxLength: 500 },
            forwardToLaravel: { type: 'boolean' },
            selectors: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string', minLength: 1 },
                content: { type: 'string', minLength: 1 },
                image: { type: 'string', minLength: 1 },
                publishedAt: { type: 'string', minLength: 1 },
              },
            },
          },
        },
      },
    },
  },
}, async (request, reply) => {
  const article = await scrapeArticle(request.body.url, request.body.config);
  const shouldForward = request.body.config?.forwardToLaravel
    ?? process.env.FORWARD_TO_LARAVEL === 'true';

  if (shouldForward) {
    await sendArticleToLaravel(article);
  }

  return reply.send({
    data: article,
    forwardedToLaravel: shouldForward,
  });
});

server.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  if (error instanceof ScraperError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  if ('validation' in error && error.validation) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
      },
    });
  }

  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
});

const start = async (): Promise<void> => {
  try {
    await server.listen({
      host: process.env.HOST ?? '0.0.0.0',
      port: Number(process.env.PORT ?? 3001),
    });
  } catch (error: unknown) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
