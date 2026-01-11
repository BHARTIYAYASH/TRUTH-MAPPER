'use server';
/**
 * @fileOverview A flow to explain a given logical fallacy.
 *
 * - explainLogicalFallacy - A function that provides an explanation for a logical fallacy.
 * - ExplainLogicalFallacyInput - The input type for the explainLogicalFallacy function.
 * - ExplainLogicalFallacyOutput - The return type for the explainLogicalFallacy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLogicalFallacyInputSchema = z.object({
  fallacyName: z.string().describe('The name of the logical fallacy to explain.'),
});
export type ExplainLogicalFallacyInput = z.infer<typeof ExplainLogicalFallacyInputSchema>;

const ExplainLogicalFallacyOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the logical fallacy.'),
});
export type ExplainLogicalFallacyOutput = z.infer<typeof ExplainLogicalFallacyOutputSchema>;

export async function explainLogicalFallacy(
  input: ExplainLogicalFallacyInput
): Promise<ExplainLogicalFallacyOutput> {
  return explainLogicalFallacyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLogicalFallacyPrompt',
  input: {schema: ExplainLogicalFallacyInputSchema},
  output: {schema: ExplainLogicalFallacyOutputSchema},
  prompt: `You are an expert in logic and rhetoric. Provide a clear, concise explanation for the following logical fallacy: {{{fallacyName}}}. 

Explain what the fallacy is and provide a simple example.
{{json}}
`,
});

const explainLogicalFallacyFlow = ai.defineFlow(
  {
    name: 'explainLogicalFallacyFlow',
    inputSchema: ExplainLogicalFallacyInputSchema,
    outputSchema: ExplainLogicalFallacyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
