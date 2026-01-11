'use server';
/**
 * @fileOverview A tool for performing searches on X (formerly Twitter) using the official Twitter API v2.
 *
 * - twitterSearch - A Genkit tool that searches X for a given query.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TwitterSearchInputSchema = z.object({
  query: z.string().describe('The search query for X/Twitter. Exclude hashtags or "from:" filters, just provide the keywords.'),
});

const TweetAuthorSchema = z.object({
  name: z.string().describe("The author's display name."),
  username: z.string().describe("The author's unique username/handle."),
  profile_image_url: z.string().url().describe("URL to the author's profile picture."),
});

const PublicMetricsSchema = z.object({
    retweet_count: z.number(),
    reply_count: z.number(),
    like_count: z.number(),
    impression_count: z.number(),
});

const TweetResultSchema = z.object({
    id: z.string().describe('The unique ID of the tweet.'),
    text: z.string().describe('The full text content of the tweet.'),
    author: TweetAuthorSchema,
    created_at: z.string().describe('The date and time the tweet was created.'),
    public_metrics: PublicMetricsSchema.describe('Engagement metrics for the tweet.'),
});

const TwitterSearchOutputSchema = z.array(TweetResultSchema);

export const twitterSearch = ai.defineTool(
  {
    name: 'twitterSearch',
    description: 'Searches X (formerly Twitter) for recent, relevant public tweets using a keyword query. Returns a list of tweets with author and metric details.',
    inputSchema: TwitterSearchInputSchema,
    outputSchema: TwitterSearchOutputSchema,
  },
  async (input) => {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken || bearerToken === 'YOUR_BEARER_TOKEN_HERE') {
      throw new Error('TWITTER_BEARER_TOKEN is not configured. Please add it to your .env file.');
    }

    console.log(`Performing direct X search for: ${input.query}`);

    // We search for English language, non-retweet posts, sorted by relevancy.
    // We also ask for expansions to get full user objects and tweet metrics.
    const searchParams = new URLSearchParams({
        'query': `${input.query} lang:en -is:retweet`,
        'tweet.fields': 'created_at,author_id,public_metrics',
        'expansions': 'author_id',
        'user.fields': 'profile_image_url,username,name',
        'max_results': '20', // Request more tweets to have a better pool for sorting
        'sort_order': 'relevancy' // Sort by relevance and impact
    });

    try {
      const response = await fetch(`https://api.twitter.com/2/tweets/search/recent?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error('Error from Twitter API:', errorBody);
        throw new Error(`Twitter API request failed with status ${response.status}: ${errorBody.title || 'Unknown error'}`);
      }

      const body = await response.json();
      
      const tweetsData = body.data || [];
      const usersData = body.includes?.users || [];
      const usersById = new Map(usersData.map((user: any) => [user.id, user]));

      if (tweetsData.length === 0) {
        // No tweets found is a valid (empty) result, not an error.
        return [];
      }
      
      const hydratedTweets = tweetsData.map((tweet: any) => {
        const author = usersById.get(tweet.author_id);
        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          public_metrics: {
            retweet_count: tweet.public_metrics?.retweet_count || 0,
            reply_count: tweet.public_metrics?.reply_count || 0,
            like_count: tweet.public_metrics?.like_count || 0,
            impression_count: tweet.public_metrics?.impression_count || 0,
          },
          author: {
            name: author?.name || 'Unknown User',
            username: author?.username || 'unknown',
            profile_image_url: author?.profile_image_url || 'https://placehold.co/48x48',
          }
        };
      });

      return hydratedTweets;

    } catch (error: any) {
      console.error('Error performing Twitter search:', error);
      // Re-throw the error so the server action can catch it and inform the user.
      throw new Error(`Twitter search failed: ${error.message}`);
    }
  }
);
