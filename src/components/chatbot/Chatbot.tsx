
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { chat, type ChatInput, type ChatOutput } from '@/ai/flows/chat-flow';
import toast from 'react-hot-toast';
import type { Message, Part } from 'genkit';

// We define a more specific type for the content parts we expect to handle
interface HandledPart {
    text?: string;
    toolRequest?: {
        name: string;
        input: any;
    };
    toolResponse?: {
        name: string;
        output: any;
    };
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
   useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', content: [{ text: "Hello! I'm PhysioBot. How can I help you today? Feel free to describe any symptoms you're experiencing." }] }
      ]);
    }
   }, [isOpen, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
        const result = await chat({ messages: newMessages });
        setMessages(result.history);
    } catch (error) {
        console.error("Error calling chat flow:", error);
        toast.error("I'm sorry, I encountered an error. Please try again.");
        const errorMessage: Message = { 
            role: 'model',
            content: [{ text: "I'm having trouble connecting right now. Please try again in a moment."}]
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setLoading(false);
    }
  };

  const renderContentPart = (part: Part, index: number) => {
      const handledPart = part as HandledPart;
      if (handledPart.text) {
          return <p key={index} className="text-sm">{handledPart.text}</p>;
      }
      if (handledPart.toolResponse && handledPart.toolResponse.name === 'suggestTreatmentTool') {
          const output = handledPart.toolResponse.output;
          return (
              <div key={index} className="mt-3 space-y-2">
                  <p className="font-semibold text-sm">Would you like to book one of these treatments?</p>
                  {output.recommendations.map((rec: any) => (
                      <Button asChild key={rec.id} size="sm" className="w-full justify-start" variant="secondary">
                          <Link href={`/book?treatment=${rec.id}`}>Book {rec.name}</Link>
                      </Button>
                  ))}
              </div>
          );
      }
      // Silently ignore toolRequest parts as they are not meant for display
      if (handledPart.toolRequest) {
          return null;
      }
      return <p key={index} className="text-sm text-red-500">[Unsupported content type]</p>;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-full max-w-sm h-[70vh] bg-card border border-border rounded-lg shadow-xl flex flex-col z-50"
          >
            <header className="p-4 border-b border-border flex items-center">
              <Bot className="text-primary mr-2" />
              <h2 className="font-bold text-lg text-card-foreground">PhysioBot Assistant</h2>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => {
                // We only want to display messages from the user or the model.
                // Tool responses are handled within the model's message content.
                if (message.role === 'tool') return null;

                return (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      {message.role === 'model' && <Bot className="text-primary flex-shrink-0" />}
                      
                      <div className={`rounded-lg p-3 max-w-xs ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {message.content.map(renderContentPart)}
                      </div>

                      {message.role === 'user' && <User className="text-primary flex-shrink-0" />}
                    </div>
                )
              })}
               {loading && (
                    <div className="flex items-start gap-3">
                        <Bot className="text-primary flex-shrink-0" />
                        <div className="rounded-lg p-3 bg-muted text-muted-foreground">
                            <Loader2 className="animate-spin h-5 w-5" />
                        </div>
                    </div>
                )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your symptoms..."
                className="flex-1 bg-transparent focus:outline-none text-sm text-card-foreground"
                disabled={loading}
              />
              <Button type="submit" size="icon" variant="ghost" disabled={loading || !input.trim()}>
                <Send size={20} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
