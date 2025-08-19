
'use server';
/**
 * @fileOverview Implements a conversational AI chatbot flow.
 *
 * This file defines a Genkit flow that manages a conversation with a user.
 * It can engage in general conversation and use a "tool" to suggest
 * physiotherapy treatments when appropriate.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { suggestTreatmentTool } from './suggest-treatment-flow';
import type { Message } from 'genkit';

// Define the input schema for the chat flow, which is a history of messages.
const ChatInputSchema = z.object({
  messages: z.array(z.custom<Message>()),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Define the output schema, which is the full updated history.
const ChatOutputSchema = z.object({
  history: z.array(z.custom<Message>()),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

/**
 * An asynchronous function that takes the current conversation history and
 * returns the AI's response, including any tool calls.
 * @param input The input object containing the message history.
 * @returns A promise that resolves to an object containing the updated history.
 */
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

// Define the underlying Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history } = await ai.generate({
      // Provide the model with the tool(s) it can use.
      tools: [suggestTreatmentTool],
      history: input.messages,
      prompt: `You are PhysioBot, a friendly and helpful physiotherapy clinic assistant.
      
      Your personality is:
      - **Polite & Empathetic**: Always be polite and show empathy for the user's condition.
      - **Conversational**: Don't be too robotic. Engage in natural conversation.
      - **Helpful**: Your primary goal is to help the user.
      
      Your instructions are:
      1.  **Engage in conversation**: If the user says "hi" or asks a general question, respond naturally.
      2.  **Identify when to use tools**: When the user describes symptoms of pain, discomfort, or a medical condition, use the \`suggestTreatmentTool\` to provide recommendations.
      3.  **Do not recommend treatments yourself**: You are not a doctor. Only use the provided tool to get treatment suggestions. Do not make up your own recommendations.
      4.  **Handle the tool's output**: The tool will return an analysis and a list of recommendations. Your job is to present this information clearly to the user. Start with the analysis provided by the tool. Then, list the recommended treatments.
      `,
    });

    return { history };
  }
);
