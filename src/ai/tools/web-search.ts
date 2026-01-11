'use server';
/**
 * @fileOverview A tool for performing web searches using Firecrawl ONLY.
 *
 * - webSearch - A Genkit tool that searches the web for a given query.
 * - searchWeb - Standalone function for direct use in flows.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WebSearchInputSchema = z.object({
  query: z.string().describe('The search query.'),
});

const WebSearchResultSchema = z.object({
  title: z.string().describe('The title of the search result.'),
  link: z.string().describe('The URL of the search result.'),
  snippet: z.string().describe('A brief summary of the search result.'),
});

const WebSearchOutputSchema = z.array(WebSearchResultSchema);

// Trusted news outlets for filtering - Expanded for global coverage
const TRUSTED_NEWS_OUTLETS: string[] = [
  "opindia.com",
  "swarajyamag.com",
  "thehindu.com",
  "indianexpress.com",
  "hindustantimes.com",
  "timesofindia.indiatimes.com",
  "ndtv.com",
  "bbc.com",
  "reuters.com",
  "aljazeera.com",
  "cnn.com",
  "nytimes.com",
  "washingtonpost.com",
  "theguardian.com",
  "businesstoday.in",
  "livemint.com",
  "economictimes.indiatimes.com",
  "firstpost.com",
  "wionews.com",
  "apnews.com",
  "bloomberg.com",
  "cnbc.com",
];

/**
 * Standalone Search Function using Firecrawl ONLY
 */
export async function searchWeb(query: string): Promise<{ title: string; link: string; snippet: string }[]> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;

  if (!firecrawlKey || firecrawlKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Firecrawl API key not configured. Please set FIRECRAWL_API_KEY in .env');
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[WebSearch] Firecrawl search for: ${query}`);
  console.log(`${'='.repeat(60)}`);

  const siteFilter = TRUSTED_NEWS_OUTLETS.map(s => `site:${s}`).join(' OR ');
  const searchQuery = `${query} (${siteFilter})`;

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20, // Increased limit for more results
        lang: 'en',
        scrapeOptions: { formats: ['markdown'] }
      })
    });

    if (!response.ok) {
      console.warn(`[Firecrawl Search] Failed: ${response.status}`);
      // Fallback to general search without site filter
      return searchWebGeneral(query, firecrawlKey);
    }

    const data = await response.json();
    const results = (data.data || []).map((item: any) => ({
      title: item.title || 'No title',
      link: item.url,
      snippet: item.description || (item.markdown ? item.markdown.substring(0, 600) : '') || 'No snippet',
    }));

    console.log(`[Firecrawl Search] Found ${results.length} results`);

    // If we got few results, do a general search as fallback
    if (results.length < 5) {
      console.log(`[WebSearch] Low results, adding general search...`);
      const generalResults = await searchWebGeneral(query, firecrawlKey);
      const seenUrls = new Set(results.map((r: any) => r.link));
      for (const result of generalResults) {
        if (!seenUrls.has(result.link)) {
          results.push(result);
        }
      }
    }

    console.log(`[WebSearch] FINAL result count: ${results.length}`);
    console.log(`${'='.repeat(60)}\n`);

    return results.slice(0, 20);
  } catch (error: any) {
    console.warn(`[Firecrawl Search] Error: ${error.message}`);
    return searchWebGeneral(query, firecrawlKey);
  }
}

// General search without site filtering (fallback)
async function searchWebGeneral(query: string, firecrawlKey: string): Promise<{ title: string; link: string; snippet: string }[]> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        limit: 15,
        lang: 'en',
      })
    });

    if (response.ok) {
      const data = await response.json();
      return (data.data || []).map((item: any) => ({
        title: item.title || 'No title',
        link: item.url,
        snippet: item.description || 'No snippet',
      }));
    }
  } catch (e) {
    console.warn('[General Search] Firecrawl failed');
  }
  return [];
}

export const webSearch = ai.defineTool(
  {
    name: 'webSearch',
    description: 'Searches the web using Firecrawl for maximum coverage. Returns results from trusted news sources.',
    inputSchema: WebSearchInputSchema,
    outputSchema: WebSearchOutputSchema,
  },
  async (input) => {
    return searchWeb(input.query);
  }
);
