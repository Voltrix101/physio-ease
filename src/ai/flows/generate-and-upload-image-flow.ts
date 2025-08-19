'use server';

/**
 * @fileOverview A flow for generating an image and uploading it to a public hosting service.
 *
 * - generateAndUploadImage - Handles the image generation and upload process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import axios from 'axios';
import { URLSearchParams } from 'url';

const GenerateAndUploadImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the image from.'),
});
type GenerateAndUploadImageInput = z.infer<typeof GenerateAndUploadImageInputSchema>;

const GenerateAndUploadImageOutputSchema = z.object({
  imageUrl: z.string().describe('The public URL of the generated and uploaded image.'),
});
type GenerateAndUploadImageOutput = z.infer<typeof GenerateAndUploadImageOutputSchema>;

export async function generateAndUploadImage(
  input: GenerateAndUploadImageInput
): Promise<GenerateAndUploadImageOutput> {
  return generateAndUploadImageFlow(input);
}

// This is a free image hosting API key, safe to be public.
const FREEIMAGE_API_KEY = '6d207e02198a847aa98d0a2a901485a5';

const generateAndUploadImageFlow = ai.defineFlow(
  {
    name: 'generateAndUploadImageFlow',
    inputSchema: GenerateAndUploadImageInputSchema,
    outputSchema: GenerateAndUploadImageOutputSchema,
  },
  async ({ prompt }) => {
    // Step 1: Generate the image using the Genkit AI model
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const generatedImageUrl = media?.url;
    if (!generatedImageUrl) {
      throw new Error('Image generation failed to return a URL.');
    }

    // The generated URL is a data URI (e.g., 'data:image/png;base64,...').
    // We need to extract the Base64 part for the upload.
    const base64Data = generatedImageUrl.split(',')[1];
    if (!base64Data) {
      throw new Error('Could not extract base64 data from the generated image URL.');
    }

    // Step 2: Upload the image to a free image hosting service
    try {
      const params = new URLSearchParams();
      params.append('key', FREEIMAGE_API_KEY);
      params.append('action', 'upload');
      params.append('source', base64Data);
      params.append('format', 'json');

      const response = await axios.post('https://freeimage.host/api/1/upload', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data?.status_code === 200 && response.data?.image?.url) {
        // Step 3: Return the public URL of the uploaded image
        return { imageUrl: response.data.image.url };
      } else {
        throw new Error('Failed to upload image or get URL from the hosting service.');
      }
    } catch (error) {
      console.error('Error uploading image to hosting service:', error);
      throw new Error('Failed to upload the generated image.');
    }
  }
);
