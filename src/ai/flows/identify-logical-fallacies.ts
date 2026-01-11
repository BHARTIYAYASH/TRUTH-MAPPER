'use server';
/**
 * @fileOverview A logical fallacy identification AI agent.
 *
 * - identifyLogicalFallacies - A function that handles the logical fallacy identification process.
 * - IdentifyLogicalFallaciesInput - The input type for the identifyLogicalFallacies function.
 * - IdentifyLogicalFallaciesOutput - The return type for the identifyLogicalFallacies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyLogicalFallaciesInputSchema = z.object({
  argumentText: z
    .string()
    .describe('The text of the argument to analyze for logical fallacies.'),
});
export type IdentifyLogicalFallaciesInput = z.infer<typeof IdentifyLogicalFallaciesInputSchema>;

const IdentifyLogicalFallaciesOutputSchema = z.object({
  fallacies: z
    .array(z.string())
    .describe('An array of logical fallacies identified in the argument.'),
  explanation: z
    .string()
    .describe('A detailed explanation of each identified logical fallacy.'),
});
export type IdentifyLogicalFallaciesOutput = z.infer<typeof IdentifyLogicalFallaciesOutputSchema>;

export async function identifyLogicalFallacies(
  input: IdentifyLogicalFallaciesInput
): Promise<IdentifyLogicalFallaciesOutput> {
  return identifyLogicalFallaciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyLogicalFallaciesPrompt',
  input: {schema: IdentifyLogicalFallaciesInputSchema},
  output: {schema: IdentifyLogicalFallaciesOutputSchema},
  prompt: `You are an expert in logical fallacies. Your task is to identify any logical fallacies present in the given argument text and provide a detailed explanation for each fallacy. 

Argument Text: {{{argumentText}}}

Identify the fallacies and provide explanations:
{{json}}
`,
});

const identifyLogicalFallaciesFlow = ai.defineFlow(
  {
    name: 'identifyLogicalFallaciesFlow',
    inputSchema: IdentifyLogicalFallaciesInputSchema,
    outputSchema: IdentifyLogicalFallaciesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
