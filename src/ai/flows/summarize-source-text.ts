'use server';

/**
 * @fileOverview A flow that summarizes a given source text.
 *
 * - summarizeSourceText - A function that summarizes the source text.
 * - SummarizeSourceTextInput - The input type for the summarizeSourceText function.
 * - SummarizeSourceTextOutput - The return type for the summarizeSourceText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSourceTextInputSchema = z.object({
  sourceText: z.string().describe('The source text to summarize.'),
});
export type SummarizeSourceTextInput = z.infer<typeof SummarizeSourceTextInputSchema>;

const SummarizeSourceTextOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the source text.'),
});
export type SummarizeSourceTextOutput = z.infer<typeof SummarizeSourceTextOutputSchema>;

export async function summarizeSourceText(input: SummarizeSourceTextInput): Promise<SummarizeSourceTextOutput> {
  return summarizeSourceTextFlow(input);
}

const summarizeSourceTextPrompt = ai.definePrompt({
  name: 'summarizeSourceTextPrompt',
  input: {schema: SummarizeSourceTextInputSchema},
  output: {schema: SummarizeSourceTextOutputSchema},
  prompt: `Summarize the following text in a concise manner:\n\n{{{sourceText}}}`,
});

const summarizeSourceTextFlow = ai.defineFlow(
  {
    name: 'summarizeSourceTextFlow',
    inputSchema: SummarizeSourceTextInputSchema,
    outputSchema: SummarizeSourceTextOutputSchema,
  },
  async input => {
    const {output} = await summarizeSourceTextPrompt(input);
    return output!;
  }
);
