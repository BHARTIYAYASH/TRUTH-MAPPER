'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { webSearch } from '../tools/web-search';
import { twitterSearch } from '../tools/twitter-search';

// Input Schema: User Query + Context + History
const AskMoreInputSchema = z.object({
    userQuery: z.string().describe("The user's follow-up question."),
    analysisContext: z.string().describe("The JSON string of the current analysis (blueprint, summary, etc.)."),
    chatHistory: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string()
    })).describe("Previous chat messages."),
});

// Output Schema: Just the answer text
const AskMoreOutputSchema = z.object({
    answer: z.string().describe("The comprehensive answer to the user's question."),
});

export const askMoreFlow = ai.defineFlow(
    {
        name: 'askMoreFlow',
        inputSchema: AskMoreInputSchema,
        outputSchema: AskMoreOutputSchema,
    },
    async (input) => {
        // We use a simple generate call with tools enabled.
        // The model will decide if it needs to search.

        const { userQuery, analysisContext, chatHistory } = input;

        // Construct the prompt history
        // We add a System Message with the context first.
        const systemMessage = `
You are 'Ask More', an advanced AI research assistant for the 'Argument Cartographer' platform.
Your goal is to answer the user's follow-up questions about a specific Argument Analysis.

*** CURRENT ANALYSIS CONTEXT ***
${analysisContext.substring(0, 20000)} // Truncate safety for context window
*** END CONTEXT ***

**INSTRUCTIONS:**
1.  **Context First**: diverse Check if the 'CURRENT ANALYSIS CONTEXT' or 'chatHistory' already contains the answer. If yes, answer directly from it and cite it.
2.  **Live Research**: If the user asks something NOT in the context (e.g., "What happened today?" or "Check X about this"), USE THE TOOLS ("webSearch", "twitterSearch") to find live information.
3.  **Grok Style**: Be objective, detailed, and slightly conversational. If you used a tool, mention what you found.
4.  **Formatting**: Use Markdown (bold, lists) for readability.
    `;

        // Convert history to Genkit format if needed, but for 'generate' we can just append.
        // Simple approach: combine history into a "conversation string" or use the 'messages' API if using chat model directly.
        // Here we will just append the history as text blocks for the prompt to keep it simple for the single-turn generation with tools.

        let historyText = "";
        if (chatHistory && chatHistory.length > 0) {
            historyText = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
        }

        const fullPrompt = `
${systemMessage}

*** CHAT HISTORY ***
${historyText}

*** USER QUESTION ***
${userQuery}
    `;

        const response = await ai.generate({
            prompt: fullPrompt,
            tools: [webSearch, twitterSearch], // Give it the tools!
            config: {
                temperature: 0.5, // Balanced creativity
            }
        });

        return { answer: response.text };
    }
);
