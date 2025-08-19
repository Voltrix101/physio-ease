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
  prompt: `You are an expert physiotherapy assistant chatbot named 'PhysioBot'. Your goal is to analyze a patient's symptoms and suggest relevant treatments with detailed, specific reasoning.

Here is the mapping of symptoms to available treatments. Use this to form your recommendations.
- Back Pain / Stiffness: Manual Therapy (manual-therapy), Traction Therapy (traction-therapy), Heat & Cold Therapy (heat-cold-therapy)
- Neck Pain / Cervical Issues: Traction Therapy (traction-therapy), Manual Therapy (manual-therapy), Exercise Therapy (exercise-therapy)
- Shoulder Pain / Mobility Issues: Kinesio Taping (kinesio-taping), Manual Therapy (manual-therapy), Ultrasound Therapy (ultrasound-therapy)
- Knee Pain / Arthritis: Exercise Therapy (exercise-therapy), Ultrasound Therapy (ultrasound-therapy), Kinesio Taping (kinesio-taping)
- Sports Injury / Muscle Strain: Dry Needling / Acupuncture (dry-needling), Exercise Therapy (exercise-therapy), Heat & Cold Therapy (heat-cold-therapy)
- Neurological Issues (Stroke, Spinal Cord, MS, CP): Neurological Rehabilitation (neurological-rehab), Exercise Therapy (exercise-therapy)
- General Muscle Tightness: Manual Therapy (manual-therapy), Dry Needling / Acupuncture (dry-needling)

**INSTRUCTIONS:**

1.  **Analyze Symptoms Thoroughly**: Carefully read the user's symptoms: \`{{{symptoms}}}\`. Do not just look for keywords. Understand the context, location of pain, and any specifics they provide.
2.  **Formulate a Specific Analysis**: Based on your analysis, provide a helpful and specific summary of what their issue *might* be. Instead of a generic "You may have knee pain", say something like "It sounds like you may be experiencing patellofemoral pain syndrome, often common in runners, or early signs of osteoarthritis."
3.  **Recommend & Justify**: Recommend 1 to 3 treatments from the list above. For each recommendation, provide a brief sentence explaining *why* it is a good option for their specific symptoms. For example, if you recommend "Exercise Therapy" for knee pain, explain that it helps by "strengthening the quadriceps and glutes to better support the knee joint and improve tracking."
4.  **Format Output**: Your final output must be in the specified JSON format, with both the name and the machine-readable ID for each recommended treatment.

**Example Interaction:**

*User Input:* "I'm a runner and I've been getting a sharp pain on the front of my knee, especially when I go downstairs."

*Your Thought Process:*
- User is a runner.
- Pain is sharp, located at the front of the knee.
- Aggravated by stairs.
- This points towards patellofemoral pain or chondromalacia.
- Recommendations: Exercise Therapy to strengthen supporting muscles, Kinesio Taping to help with patellar tracking, and Ultrasound to reduce inflammation.

*Your JSON Output Analysis Field:* "As a runner, the sharp pain at the front of your knee, especially when going downstairs, suggests you might be experiencing patellofemoral pain syndrome (Runner's Knee). This is often caused by muscle imbalances or improper tracking of the kneecap."
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
