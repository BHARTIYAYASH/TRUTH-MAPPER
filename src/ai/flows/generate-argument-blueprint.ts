'use server';

/**
 * @fileOverview A flow to generate a structured JSON blueprint of arguments from a topic query, URL, or document.
 *
 * - generateArgumentBlueprint - A function that handles the argument blueprint generation process.
 * - GenerateArgumentBlueprintInput - The input type for the generateArgumentBlueprint function.
 * - GenerateArgumentBlueprintOutput - The return type for the generateArgumentBlueprint function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { webSearch, searchWeb } from '../tools/web-search';
import { webScraper, batchScrapeParallel } from '../tools/web-scraper';
import type { Tweet } from '@/lib/types';
import { twitterSearch } from '../tools/twitter-search';
import JSON5 from 'json5';


const GenerateArgumentBlueprintInputSchema = z.object({
  /**
   * A topic query, URL, or document to analyze.
   */
  input: z.string(),
});
export type GenerateArgumentBlueprintInput = z.infer<typeof GenerateArgumentBlueprintInputSchema>;

const ArgumentNodeSchema = z.object({
  id: z.string().describe('Unique identifier for the argument node.'),
  parentId: z.string().nullable().describe('ID of the parent node, or null if it is a root node.'),
  type: z.enum(['thesis', 'claim', 'counterclaim', 'evidence']).describe('Type of the argument node.'),
  side: z.enum(['for', 'against']).describe('Side of the argument node.'),
  content: z.string().describe('The content of the argument node.'),
  sourceText: z.string().describe('The original text snippet from the source that supports the content.'),
  source: z.string().describe('The URL of the source document.'), // Removed .url() validation to prevent "null" string errors
  fallacies: z.array(z.string()).describe('An array of logical fallacies identified in this specific argument node.'),
  logicalRole: z.string().describe("A concise statement explaining the node's function in the overall argument (e.g., 'Primary legal basis for the thesis')."),
});

const TweetAuthorSchema = z.object({
  name: z.string(),
  username: z.string(),
  profile_image_url: z.string().url(),
});

const PublicMetricsSchema = z.object({
  retweet_count: z.number(),
  reply_count: z.number(),
  like_count: z.number(),
  impression_count: z.number(),
});

const TweetSchema = z.object({
  id: z.string(),
  text: z.string(),
  author: TweetAuthorSchema,
  created_at: z.string(),
  public_metrics: PublicMetricsSchema,
});


const DetectedFallacySchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: z.enum(['Critical', 'Major', 'Minor']),
  category: z.string(),
  confidence: z.number().min(0).max(1),
  problematicText: z.string(),
  explanation: z.string(),
  definition: z.string(),
  avoidance: z.string(),
  example: z.string(),
  suggestion: z.string(),
  location: z.string().optional(),
});

const GenerateArgumentBlueprintOutputSchema = z.object({
  blueprint: z.array(ArgumentNodeSchema).describe('A structured JSON blueprint of the arguments.'),
  summary: z.string().describe("A concise, neutral summary of the overall state of the debate."),
  analysis: z.string().describe("AI-driven meta-analysis providing novel insights, identifying emerging themes, logical gaps, or the overall state of the debate."),
  credibilityScore: z.number().min(1).max(10).describe("A score from 1-10 rating the overall quality, diversity, and reliability of the sources found."),
  brutalHonestTake: z.string().describe("A candid, slightly cynical, 'no-BS' summary of the situation, written in simple, conversational language."),
  keyPoints: z.array(z.string()).describe("A list of 3-5 key takeaways or summary points."),
  socialPulse: z.string().describe("A summary of the public sentiment and key discussion points on the topic from social media platform X (Twitter)."),
  tweets: z.array(TweetSchema).describe('An array of relevant tweets from X/Twitter.'),
  fallacies: z.array(DetectedFallacySchema).optional().describe('An array of logical fallacies detected in the source material.'),
});
export type GenerateArgumentBlueprintOutput = z.infer<typeof GenerateArgumentBlueprintOutputSchema>;


export async function generateArgumentBlueprint(input: GenerateArgumentBlueprintInput): Promise<GenerateArgumentBlueprintOutput> {
  return generateArgumentBlueprintFlow(input);
}

const mainAnalysisPrompt = ai.definePrompt({
  name: 'mainAnalysisPrompt',
  input: { schema: z.object({ input: z.string(), searchQuery: z.string(), context: z.string() }) },
  output: {
    schema: z.object({
      blueprint: z.array(ArgumentNodeSchema),
      summary: z.string(),
      analysis: z.string(),
      credibilityScore: z.number(),
      brutalHonestTake: z.string(),
      keyPoints: z.array(z.string()),
      fallacies: z.array(DetectedFallacySchema),
    })
  },
  // Tools removed - we are feeding context directly
  system: `You are an expert AI assistant specializing in rigorous, balanced argument deconstruction and LOGICAL FALLACY DETECTION. Your task is to provide a comprehensive, neutral analysis of the provided topic using the PROVIDED RESEARCH CONTEXT.

**Core Principles:**
1.  **Objectivity is Paramount**: Act as a neutral synthesizer.
2.  **Depth and Detail**: Identify distinct lines of reasoning (Claim 1, Claim 2, etc.) and supporting evidence.
3.  **Ground Everything in Sources**: Every node must be tied to the PROVIDED CONTEXT.
4.  **Detect Logical Fallacies**: Actively scan the source text for errors in reasoning.

**Execution Process:**
1.  **Analyze Context**: Read the provided sources.
2.  **Identify the Thesis**: Determine the central question.
3.  **Deconstruct Both Sides**: Identify claims, counterclaims, and evidence.
4.  **Excavate Evidence**: Extract verbatim snippets.
5.  **Detect Fallacies**:
    *   Identify specific logical fallacies (e.g., Ad Hominem, Straw Man, False Dichotomy) present in the *arguments found in the text*.
    *   For each fallacy, provide:
        *   \`severity\`: Critical, Major, or Minor.
        *   \`problematicText\`: The exact quote containing the fallacy.
        *   \`explanation\`: Why it is a fallacy.
        *   \`suggestion\`: How to rephrase it logically.

6.  **Build the Blueprint**: Construct the JSON object.

You must respond with a valid JSON object enclosed in a \`\`\`json code block.`,
  prompt: `Initial Query: {{{input}}}
Search Query Used: {{{searchQuery}}}

*** RESEARCH CONTEXT (Analysis Sources) ***
{{{context}}}
`,
});

const searchQueryPrompt = ai.definePrompt({
  name: 'searchQueryPrompt',
  input: { schema: z.object({ input: z.string() }) },
  output: { schema: z.object({ searchQuery: z.string().describe("A concise 2-4 word search query representing the core topic, suitable for web and social media searches.") }) },
  prompt: `Based on the following user input, generate a concise 2-4 word search query that captures the absolute core topic.

User Input: {{{input}}}
`,
});

const socialPulsePrompt = ai.definePrompt({
  name: 'socialPulsePrompt',
  input: { schema: z.object({ tweets: z.array(z.string()) }) },
  output: { schema: z.object({ socialPulse: z.string().describe("A brief, neutral summary of the public sentiment and key discussion points, similar to the style of Grok on X.") }) },
  prompt: `You are an AI analyst. Your task is to analyze the following list of tweets about a specific topic.
Based on these tweets, write a brief, neutral summary of the public sentiment and key discussion points.
The summary should be objective and capture the main themes of the conversation, similar to the style of the "Grok" feature on X/Twitter.

Tweets:
- {{{tweets.join("\n- ")}}}
  `
});


const generateArgumentBlueprintFlow = ai.defineFlow(
  {
    name: 'generateArgumentBlueprintFlow',
    inputSchema: GenerateArgumentBlueprintInputSchema,
    outputSchema: GenerateArgumentBlueprintOutputSchema,
  },
  async (input) => {
    // Step 1: Generate a high-quality search query from the user's input.
    const searchQueryResponse = await searchQueryPrompt(input);
    const searchQuery = searchQueryResponse.output?.searchQuery;
    if (!searchQuery) {
      throw new Error("The AI failed to generate a search query from the input.");
    }

    console.log(`[Flow] Generated Query: "${searchQuery}"`);

    // Step 2: Perform DUAL Web Search explicitly to get diverse sources
    // We want at least 6-7 different news outlets
    let searchResults: { title: string; link: string; snippet: string }[] = [];
    try {
      searchResults = await searchWeb(searchQuery);
    } catch (e) {
      console.error("Web Search failed:", e);
      // Fallback: continue with empty? No, we need sources.
      throw new Error("Web Search failed during analysis flow.");
    }

    // Step 3: Select Top Diverse URLs (Unique Domains)
    const uniqueDomains = new Set<string>();
    const urlsToScrape: string[] = [];

    for (const result of searchResults) {
      try {
        const domain = new URL(result.link).hostname.replace('www.', '');
        if (!uniqueDomains.has(domain)) {
          uniqueDomains.add(domain);
          urlsToScrape.push(result.link);
        }
      } catch (e) {
        // Invalid URL, skip
      }
      if (urlsToScrape.length >= 8) break; // Aim for 8 diverse sources
    }

    console.log(`[Flow] Selected ${urlsToScrape.length} diverse URLs for scraping:`, urlsToScrape);

    // Step 4: Batch Scrape in Parallel
    let scrapedDocs: { url: string; content: string; source: string }[] = [];
    if (urlsToScrape.length > 0) {
      try {
        scrapedDocs = await batchScrapeParallel(urlsToScrape);
      } catch (e) {
        console.error("Batch scraping failed:", e);
      }
    }

    // Step 5: Construct Context
    let context = "";
    let isLimitedAnalysis = false;

    if (scrapedDocs.length > 0) {
      context = scrapedDocs.map((doc, index) => `
--- SOURCE ${index + 1} ---
URL: ${doc.url}
Extracted Text:
${doc.content.substring(0, 12000)} 
`).join("\n\n");
    } else if (searchResults.length > 0) {
      // Fallback 1: Use snippets from search
      console.warn("[Flow] Scraping failed or returned no content. Using search snippets as context.");
      context = searchResults.map(r => `
--- SOURCE (Snippet Only) ---
URL: ${r.link}
Snippet:
${r.snippet}
`).join("\n\n");
    } else {
      // Fallback 2: No search results at all (API credits depleted)
      // Use the user's raw query as the "context" - limited analysis mode
      console.warn("[Flow] No external sources available (API credits may be depleted). Using user query only.");
      isLimitedAnalysis = true;
      context = `
--- USER QUERY (No External Sources Available) ---
Topic: ${input.input}

NOTE: External search APIs are unavailable. Generate an analysis based solely on your training knowledge about this topic. Clearly indicate that sources could not be verified in real-time.
`;
    }

    console.log(`[Flow] Context prepared. Length: ${context.length} chars. Limited Mode: ${isLimitedAnalysis}`);

    // Step 6: Run Main Analysis with prepared Context
    // Pass 'context' to the prompt
    const mainAnalysisResponse = await mainAnalysisPrompt({
      input: input.input,
      searchQuery: searchQuery,
      context: context
    });
    const rawText = mainAnalysisResponse.text;

    let jsonString = "";
    const jsonBlockMatch = rawText.match(/```json\n([\s\S]*?)\n```/);

    if (jsonBlockMatch && jsonBlockMatch[1]) {
      jsonString = jsonBlockMatch[1];
    } else {
      // Fallback: Try to find the start and end of the JSON object in the raw text
      console.warn("Regex failed to find JSON block. Attempting to parse raw text.");
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = rawText.substring(firstBrace, lastBrace + 1);
      } else {
        // If we can't find braces, just try the whole thing (unlikely to work but worth a shot if it's just JSON)
        jsonString = rawText;
      }
    }

    let coreAnalysis;
    try {
      // Use JSON5 for more lenient parsing (e.g. trailing commas, single quotes)
      coreAnalysis = JSON5.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON from AI response. Raw Text:", rawText);
      throw new Error("Failed to parse the JSON from the AI's response for the main analysis.");
    }

    // Step 7: Validate and fix the output
    if (!coreAnalysis || !coreAnalysis.blueprint || coreAnalysis.blueprint.length === 0) {
      throw new Error("Blueprint gen failed: The AI did not produce a valid argument blueprint from the provided topic and web search results.");
    }

    // Fix credibilityScore if AI returned a decimal (e.g., 0.9 instead of 9)
    if (typeof coreAnalysis.credibilityScore === 'number') {
      if (coreAnalysis.credibilityScore < 1) {
        // AI likely returned a decimal like 0.9, convert to 1-10 scale
        coreAnalysis.credibilityScore = Math.round(coreAnalysis.credibilityScore * 10);
      }
      // Clamp to valid range
      coreAnalysis.credibilityScore = Math.max(1, Math.min(10, Math.round(coreAnalysis.credibilityScore)));
    } else {
      coreAnalysis.credibilityScore = 5; // Default fallback
    }

    // Fix source URIs: AI sometimes returns "null" string instead of a valid URI
    if (coreAnalysis.blueprint && Array.isArray(coreAnalysis.blueprint)) {
      coreAnalysis.blueprint = coreAnalysis.blueprint.map((node: any) => {
        if (!node.source || node.source === 'null' || node.source.toLowerCase() === 'null') {
          node.source = 'https://user-input.local/query'; // Placeholder for thesis/user-sourced nodes
        }
        if (!node.parentId || node.parentId === 'null') {
          node.parentId = null;
        }
        return node;
      });
    }

    // Step 8: Twitter/Social Pulse (unchanged)
    let tweets: Tweet[] = [];
    let socialPulse = "";
    try {
      console.log(`Attempting to fetch tweets with generated query: "${searchQuery}"`);
      const twitterResult = await twitterSearch({ query: searchQuery });

      if (twitterResult && twitterResult.length > 0) {
        const sortedTweets = twitterResult.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count);
        tweets = sortedTweets;
        const socialPulseResult = await socialPulsePrompt({ tweets: tweets.map(t => t.text) });
        socialPulse = socialPulseResult.output?.socialPulse || "";
      }
    } catch (error: any) {
      console.error("Twitter search failed, continuing. Error:", error.message);
    }

    // Step 9: Combine results
    return {
      ...coreAnalysis,
      socialPulse: socialPulse,
      tweets: tweets.slice(0, 5),
    };
  }
);
