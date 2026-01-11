'use server';
/**
 * @fileOverview Web scraper using Firecrawl ONLY for maximum reliability.
 *
 * - webScraper - A Genkit tool that fetches and parses a webpage to extract its main text.
 * - batchScrapeParallel - Batch scrape multiple URLs in parallel using Firecrawl.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WebScraperInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to scrape.'),
});

const WebScraperOutputSchema = z.string().describe('The extracted textual content of the webpage.');

/**
 * Scrape using Firecrawl API
 */
async function scrapeWithFirecrawl(url: string): Promise<string | null> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;

  if (!firecrawlKey || firecrawlKey === 'YOUR_API_KEY_HERE') {
    console.log(`[Firecrawl] No API key configured`);
    return null;
  }

  try {
    console.log(`[Firecrawl] Scraping: ${url}`);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        timeout: 30000
      })
    });

    if (!response.ok) {
      console.warn(`[Firecrawl] Failed with status ${response.status} for ${url}`);
      return null;
    }

    const data = await response.json();
    const markdown = data.data?.markdown;

    if (!markdown || markdown.length < 100) {
      console.warn(`[Firecrawl] Content too short for ${url}`);
      return null;
    }

    console.log(`[Firecrawl] ✓ Success: ${url} (${markdown.length} chars)`);
    // Increased limit from 15000 to 20000 for more context
    return markdown.substring(0, 20000);

  } catch (error: any) {
    console.warn(`[Firecrawl] Error for ${url}: ${error.message}`);
    return null;
  }
}

export const webScraper = ai.defineTool(
  {
    name: 'webScraper',
    description: 'Fetches the full content of a given URL using Firecrawl. Use this to read the content of an article or webpage.',
    inputSchema: WebScraperInputSchema,
    outputSchema: WebScraperOutputSchema,
  },
  async (input) => {
    const content = await scrapeWithFirecrawl(input.url);

    if (!content) {
      throw new Error(`Failed to scrape content from ${input.url} with Firecrawl.`);
    }

    return content;
  }
);

/**
 * BATCH SCRAPER - Scrapes multiple URLs in parallel using Firecrawl
 */
export async function batchScrapeParallel(urls: string[]): Promise<{ url: string; content: string; source: string }[]> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[BatchScrape] Starting scrape of ${urls.length} URLs`);
  console.log(`${'='.repeat(60)}\n`);

  const results: { url: string; content: string; source: string }[] = [];

  // Scrape all URLs in parallel with Firecrawl
  const scrapePromises = urls.map(async (url) => {
    const content = await scrapeWithFirecrawl(url);
    return { url, content, source: 'Firecrawl' };
  });

  const scrapeResults = await Promise.all(scrapePromises);

  // Collect successful results
  for (const result of scrapeResults) {
    if (result.content) {
      results.push({ url: result.url, content: result.content, source: result.source });
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[BatchScrape] COMPLETED: ${results.length}/${urls.length} URLs scraped successfully`);
  console.log(`${'='.repeat(60)}\n`);

  return results;
}
