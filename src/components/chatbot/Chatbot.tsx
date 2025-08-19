'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { suggestTreatment, SuggestTreatmentOutput } from '@/ai/flows/suggest-treatment-flow';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  type: 'user' | 'bot';
  text?: string;
  recommendations?: SuggestTreatmentOutput['recommendations'];
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
    if (isOpen) {
      setMessages([
        { id: 1, type: 'bot', text: "Hello! I'm PhysioBot. How can I help you today? Please describe your symptoms." }
      ]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { id: Date.now(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        const result = await suggestTreatment({ symptoms: input });
        
        const botMessage: Message = { 
            id: Date.now() + 1, 
            type: 'bot', 
            text: result.analysis,
            recommendations: result.recommendations,
        };
        setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
        console.error("Error calling suggestTreatment flow:", error);
        toast.error("I'm sorry, I encountered an error. Please try again.");
        const errorMessage: Message = { 
            id: Date.now() + 1, 
            type: 'bot', 
            text: "I'm having trouble connecting right now. Please try again in a moment."
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setLoading(false);
    }
  };

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
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                   {message.type === 'bot' && <Bot className="text-primary flex-shrink-0" />}
                   <div className={`rounded-lg p-3 max-w-xs ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <p className="text-sm">{message.text}</p>
                      {message.recommendations && (
                          <div className="mt-3 space-y-2">
                            <p className="font-semibold text-sm">Would you like to book one of these treatments?</p>
                            {message.recommendations.map(rec => (
                                <Button asChild key={rec.id} size="sm" className="w-full justify-start" variant="secondary">
                                    <Link href={`/book?treatment=${rec.id}`}>Book {rec.name}</Link>
                                </Button>
                            ))}
                          </div>
                      )}
                   </div>
                   {message.type === 'user' && <User className="text-primary flex-shrink-0" />}
                </div>
              ))}
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
