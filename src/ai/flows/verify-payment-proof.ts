'use server';

/**
 * @fileOverview Implements an AI tool to analyze payment proof screenshots or transaction IDs.
 *
 * - verifyPaymentProof - Analyzes payment proof and suggests if payment confirmation is present.
 * - VerifyPaymentProofInput - The input type for the verifyPaymentProof function.
 * - VerifyPaymentProofOutput - The return type for the verifyPaymentProof function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyPaymentProofInputSchema = z.object({
  paymentProof: z
    .string()
    .describe(
      "A screenshot of the payment proof, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'., or a transaction ID."
    ),
});
export type VerifyPaymentProofInput = z.infer<typeof VerifyPaymentProofInputSchema>;

const VerifyPaymentProofOutputSchema = z.object({
  paymentConfirmationSuggested: z
    .boolean()
    .describe("Whether the AI suggests that payment confirmation is present in the proof."),
  reason: z.string().describe('The reasoning behind the AI suggestion.'),
});
export type VerifyPaymentProofOutput = z.infer<typeof VerifyPaymentProofOutputSchema>;

export async function verifyPaymentProof(input: VerifyPaymentProofInput): Promise<VerifyPaymentProofOutput> {
  return verifyPaymentProofFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyPaymentProofPrompt',
  input: {schema: VerifyPaymentProofInputSchema},
  output: {schema: VerifyPaymentProofOutputSchema},
  prompt: `You are an AI assistant helping a doctor verify patient payments.

You will analyze the provided payment proof (a screenshot or transaction ID) and determine if it provides sufficient evidence of payment.

Provide a suggestion as to whether the payment confirmation is present in the proof, along with a brief reason for your suggestion.

Payment Proof: {{{paymentProof}}}`,
});

const verifyPaymentProofFlow = ai.defineFlow(
  {
    name: 'verifyPaymentProofFlow',
    inputSchema: VerifyPaymentProofInputSchema,
    outputSchema: VerifyPaymentProofOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
