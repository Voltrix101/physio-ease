
'use server';
/**
 * @fileOverview Implements a conversational AI chatbot flow.
 *
 * This file defines a simple chat function that processes user messages
 * and returns AI responses using Genkit.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Simple message interface for our chat
interface SimpleMessage {
  role: 'user' | 'model';
  text: string;
}

// Define the input schema for the chat flow
const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Define the output schema
const ChatOutputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

/**
 * Simple chat function that processes messages and returns responses
 */
export async function chat(input: ChatInput): Promise<ChatOutput> {
  try {
    // Validate input
    if (!input || !input.history || !Array.isArray(input.history)) {
      throw new Error('Invalid input: history array is required');
    }

    // Get the last user message
    const lastMessage = input.history[input.history.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    // Generate a simple response using Genkit
    const response = await ai.generate(`
      You are PhysioBot, a friendly physiotherapy clinic assistant.
      
      User said: "${lastMessage.text}"
      
      Previous conversation context:
      ${input.history.slice(0, -1).map(msg => `${msg.role}: ${msg.text}`).join('\n')}
      
      Respond as a helpful physiotherapy assistant. Keep responses conversational and helpful.
      If the user describes pain or symptoms, suggest they book an appointment or provide general wellness advice.
    `);

    // Create the assistant's response
    const assistantMessage: SimpleMessage = {
      role: 'model',
      text: response.text || "I'm here to help! How can I assist you with your physiotherapy needs?"
    };

    // Build updated history
    const updatedHistory = [...input.history, assistantMessage];
    
    return { history: updatedHistory };
  } catch (error) {
    console.error('Chat error:', error);
    
    // Return an error response
    const errorMessage: SimpleMessage = {
      role: 'model',
      text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
    };

    return { 
      history: [...input.history, errorMessage]
    };
  }
}
