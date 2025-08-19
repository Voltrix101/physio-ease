'use server';
/**
 * @fileOverview Implements an AI chatbot flow to suggest physiotherapy treatments.
 *
 * This file defines a Genkit flow that acts as a chatbot, analyzing a patient's
 * described symptoms and recommending relevant treatments based on a predefined mapping.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the treatment suggestion flow
const SuggestTreatmentInputSchema = z.object({
  symptoms: z.string().describe("The user's description of their symptoms."),
});
export type SuggestTreatmentInput = z.infer<typeof SuggestTreatmentInputSchema>;

// Output schema for the treatment suggestion flow
const SuggestTreatmentOutputSchema = z.object({
  analysis: z.string().describe("A brief analysis of the user's potential condition."),
  recommendations: z.array(z.object({
      id: z.string().describe('The machine-readable ID of the recommended treatment.'),
      name: z.string().describe('The human-readable name of the recommended treatment.'),
    })
  ).describe('A list of recommended treatments.'),
});
export type SuggestTreatmentOutput = z.infer<typeof SuggestTreatmentOutputSchema>;

/**
 * An asynchronous function that takes a user's symptoms and returns a list of
 * suggested treatments and an analysis.
 * @param input The input object containing the user's symptoms.
 * @returns A promise that resolves to an object containing the analysis and recommendations.
 */
export async function suggestTreatment(input: SuggestTreatmentInput): Promise<SuggestTreatmentOutput> {
  return suggestTreatmentFlow(input);
}

// Define the Genkit prompt with the symptom-to-treatment mapping
const prompt = ai.definePrompt({
  name: 'suggestTreatmentPrompt',
  input: { schema: SuggestTreatmentInputSchema },
  output: { schema: SuggestTreatmentOutputSchema },
  prompt: `You are an expert physiotherapy assistant chatbot named 'PhysioBot'. Your goal is to analyze a patient's symptoms and suggest relevant treatments.

Here is the mapping of symptoms to available treatments. Use this to form your recommendations.
- Back Pain / Stiffness: Manual Therapy (manual-therapy), Traction Therapy (traction-therapy), Heat & Cold Therapy (heat-cold-therapy)
- Neck Pain / Cervical Issues: Traction Therapy (traction-therapy), Manual Therapy (manual-therapy), Exercise Therapy (exercise-therapy)
- Shoulder Pain / Mobility Issues: Kinesio Taping (kinesio-taping), Manual Therapy (manual-therapy), Ultrasound Therapy (ultrasound-therapy)
- Knee Pain / Arthritis: Exercise Therapy (exercise-therapy), Ultrasound Therapy (ultrasound-therapy), Kinesio Taping (kinesio-taping)
- Sports Injury / Muscle Strain: Dry Needling / Acupuncture (dry-needling), Exercise Therapy (exercise-therapy), Heat & Cold Therapy (heat-cold-therapy)
- Neurological Issues (Stroke, Spinal Cord, MS, CP): Neurological Rehabilitation (neurological-rehab), Exercise Therapy (exercise-therapy)
- General Muscle Tightness: Manual Therapy (manual-therapy), Dry Needling / Acupuncture (dry-needling)

Analyze the user's symptoms: {{{symptoms}}}

Based on your analysis, provide a brief, helpful summary of what their issue might be (e.g., "It sounds like you may have lumbar strain or spinal disc pressure."). Then, recommend 1 to 3 treatments from the list above that are most relevant to their symptoms.

Your final output must be in the specified JSON format, with both the name and the ID for each recommended treatment.
`,
});

// Define the underlying Genkit flow
const suggestTreatmentFlow = ai.defineFlow(
  {
    name: 'suggestTreatmentFlow',
    inputSchema: SuggestTreatmentInputSchema,
    outputSchema: SuggestTreatmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return a valid output.");
    }
    return output;
  }
);
