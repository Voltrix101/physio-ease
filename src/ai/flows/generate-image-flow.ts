'use server';
/**
 * @fileOverview Implements an AI flow to generate an image from a text prompt.
 *
 * This file defines a Genkit flow that uses an AI model to generate an image
 * based on a provided text prompt and returns the image as a data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the image generation flow
const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

// Output schema for the image generation flow
const GenerateImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

/**
 * An asynchronous function that takes a prompt and returns a generated image as a data URI.
 * This is the only function exported from this module.
 * @param input The input object containing the text prompt.
 * @returns A promise that resolves to an object containing the imageUrl as a data URI.
 */
export async function generateImage(input: GenerateImage.GenerateImageInput): Promise<GenerateImage.GenerateImageOutput> {
  return generateImageFlow(input);
}

// Define the underlying Genkit flow
const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `a professional, high-quality, photorealistic image for a physiotherapy clinic website: ${input.prompt}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a data URI.');
    }

    return { imageUrl: media.url };
  }
);

// Namespace the types to avoid polluting the module's exports
export namespace GenerateImage {
    export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;
    export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;
}
