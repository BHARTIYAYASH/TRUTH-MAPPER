'use server';

import 'dotenv/config';
import { generateArgumentBlueprint } from '@/ai/flows/generate-argument-blueprint';
import { summarizeSourceText } from '@/ai/flows/summarize-source-text';
import type { AnalysisResult } from './types';
import { webScraper } from '@/ai/tools/web-scraper';
import { getAdminAuth, getAdminFirestore } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const MAX_INPUT_LENGTH = 15000; // 15k characters limit before summarizing

export async function handleAnalysis(
  prevState: any,
  formData: FormData
): Promise<{ data: AnalysisResult | null; error: string | null; }> {
  const rawInput = formData.get('input') as string;
  const inputType = formData.get('inputType') as string;
  const authToken = formData.get('authToken') as string;

  if (!rawInput || rawInput.trim().length === 0) {
    return { data: null, error: 'Input cannot be empty.' };
  }

  // --- Get User ---
  if (!authToken) {
    return { data: null, error: "You must be logged in to perform an analysis. No Auth token found." };
  }

  let user;
  try {
    const auth = getAdminAuth();
    user = await auth.verifyIdToken(authToken);
  } catch (error) {
    console.error("Auth token verification failed:", error);
    return { data: null, error: "Your session is invalid or has expired. Please log in again." };
  }

  if (!user) {
    return { data: null, error: "You must be logged in to perform an analysis." };
  }

  try {
    let finalInputForAI = rawInput;
    let topicForDB = rawInput;

    if (inputType === 'URL') {
      try {
        console.log(`Input is a URL. Scraping content from: ${rawInput}`);
        const scrapedText = await webScraper({ url: rawInput });
        if (!scrapedText || scrapedText.trim().length < 100) {
          throw new Error("Scraped content was too short or empty.");
        }
        console.log(`Scraping successful. Content length: ${scrapedText.length}`);
        finalInputForAI = scrapedText;
        topicForDB = rawInput; // Use the URL itself as the name for the DB entry
      } catch (e: any) {
        console.error("Web scraping failed:", e);
        const errorMessage = e.message || 'An unknown error occurred during scraping.';
        return { data: null, error: `Failed to fetch content from the URL. The site may be blocking scrapers, the URL may be invalid, or the page may not contain enough text. ${errorMessage}` };
      }
    } else {
      topicForDB = rawInput.substring(0, 150); // Use first 150 chars as topic
    }


    // If the input is a document and it's too long, summarize it first.
    if (finalInputForAI.length > MAX_INPUT_LENGTH) {
      try {
        console.log(`Input is too long (${finalInputForAI.length} chars). Summarizing before analysis...`);
        const summaryResult = await summarizeSourceText({ sourceText: finalInputForAI });
        finalInputForAI = summaryResult.summary;
        console.log(`Summary created. New length: ${finalInputForAI.length} chars.`);
      } catch (e: any) {
        console.error("Summarization failed:", e);
        const errorMessage = e.message || 'An unknown error occurred during summarization.';
        return { data: null, error: `Failed to summarize the large document. ${errorMessage}` };
      }
    }

    const analysisResult = await generateArgumentBlueprint({ input: finalInputForAI });

    if (!analysisResult || !analysisResult.blueprint || analysisResult.blueprint.length === 0) {
      return { data: null, error: 'Could not generate an argument map from the provided input. The topic might be too ambiguous or the AI service could be busy. Please try a different topic or try again shortly.' };
    }

    // --- Save to Firestore ---
    try {
      const firestore = getAdminFirestore();
      const docRef = firestore.collection('users').doc(user.uid).collection('argumentMaps').doc();

      await docRef.set({
        id: docRef.id,
        userId: user.uid,
        name: topicForDB,
        creationDate: FieldValue.serverTimestamp(),
        jsonData: JSON.stringify(analysisResult)
      });
      console.log('Successfully saved analysis to Firestore.');
    } catch (dbError: any) {
      console.error("Firestore save error:", dbError);
      // We don't block the user from seeing the result if the save fails.
      // We'll return the data but can add a non-critical toast in the UI later if needed.
    }

    return { data: analysisResult, error: null };

  } catch (e: any) {
    console.error("Fatal Error in handleAnalysis:", e);

    const errorMessage = e.message || 'An unexpected server error occurred.';

    if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable') || errorMessage.includes('overloaded')) {
      return { data: null, error: 'The AI service is temporarily overloaded. Please wait a moment and try your analysis again.' };
    }

    if (errorMessage.includes('SerpApi')) {
      return { data: null, error: `Web search failed. Please check your SERPAPI_API_KEY and try again.` };
    }
    if (errorMessage.includes('Twitter')) {
      return { data: null, error: `X/Twitter search failed. Please check your TWITTER_BEARER_TOKEN and try again.` };
    }
    if (errorMessage.includes('Web scraper')) {
      return { data: null, error: `Failed to fetch content from the URL. The site may be blocking scrapers or the URL may be invalid.` };
    }

    return { data: null, error: `Analysis failed: ${errorMessage}` };
  }
}

/**
 * Fetches a saved analysis from Firestore by document ID.
 */
export async function getSavedAnalysis(
  docId: string,
  authToken: string
): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!docId) {
    return { data: null, error: 'Document ID is required.' };
  }

  if (!authToken) {
    return { data: null, error: 'You must be logged in to view saved analyses.' };
  }

  let user;
  try {
    const auth = getAdminAuth();
    user = await auth.verifyIdToken(authToken);
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return { data: null, error: 'Your session is invalid or has expired. Please log in again.' };
  }

  if (!user) {
    return { data: null, error: 'You must be logged in to view saved analyses.' };
  }

  try {
    const firestore = getAdminFirestore();
    const docRef = firestore.collection('users').doc(user.uid).collection('argumentMaps').doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { data: null, error: 'Analysis not found. It may have been deleted.' };
    }

    const docData = docSnap.data();

    if (!docData || !docData.jsonData) {
      return { data: null, error: 'Invalid analysis data.' };
    }

    // Verify ownership
    if (docData.userId !== user.uid) {
      return { data: null, error: 'You do not have permission to view this analysis.' };
    }

    const analysisResult: AnalysisResult = JSON.parse(docData.jsonData);
    return { data: analysisResult, error: null };
  } catch (e: any) {
    console.error('Error fetching saved analysis:', e);
    return { data: null, error: `Failed to load analysis: ${e.message}` };
  }
}

/**
 * Handles the "Ask More" chat functionality.
 */
import { askMoreFlow } from '@/ai/flows/ask-more';

export async function handleAskMore(
  userQuery: string,
  analysisResult: AnalysisResult,
  history: { role: 'user' | 'model'; content: string }[] = []
): Promise<{ answer: string | null; error: string | null }> {
  try {
    const analysisContext = JSON.stringify(analysisResult);

    // Call the AI flow
    const response = await askMoreFlow({
      userQuery,
      analysisContext,
      chatHistory: history
    });

    return { answer: response.answer, error: null };
  } catch (e: any) {
    console.error("Ask More Flow failed:", e);
    return { answer: null, error: e.message || "Failed to generate answer." };
  }
}
