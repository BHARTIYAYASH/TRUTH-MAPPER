'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-source-text.ts';
import '@/ai/flows/identify-logical-fallacies.ts';
import '@/ai/flows/generate-argument-blueprint.ts';
import '@/ai/flows/explain-logical-fallacy.ts';
import '@/ai/tools/web-search.ts';
import '@/ai/tools/twitter-search.ts';
import '@/ai/tools/web-scraper.ts';
