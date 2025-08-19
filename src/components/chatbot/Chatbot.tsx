
"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';

type Msg = { 
  role: "bot" | "user"; 
  text: string; 
  cta?: { label: string; url: string } | null;
  recommendations?: Array<{ name: string; id: string }>;
};

const QUICK = ["Start Consultation", "Back Pain", "Neck Pain", "Knee Pain", "Shoulder Pain", "Posture Issue"];

// Memoize the message component to prevent unnecessary re-renders
const MessageComponent = memo(({ message, index }: { message: Msg; index: number }) => (
  <div key={index} className={message.role === "user" ? "text-right" : "text-left"}>
    <div className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "bot" && <Bot className="text-primary flex-shrink-0 mt-1" size={16} />}
      
      <div
        className={
          "inline-block max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 " +
          (message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground")
        }
      >
        {message.text}
      </div>

      {message.role === "user" && <User className="text-primary flex-shrink-0 mt-1" size={16} />}
    </div>

    {/* CTA Button */}
    {message.cta && message.role === "bot" && (
      <div className="mt-2 flex justify-start">
        <Link
          href={message.cta.url}
          className="inline-block rounded-lg bg-primary text-primary-foreground text-sm px-3 py-1.5 hover:opacity-90 transition"
        >
          {message.cta.label}
        </Link>
      </div>
    )}

    {/* Recommendations */}
    {message.recommendations && message.recommendations.length > 0 && message.role === "bot" && (
      <div className="mt-2 space-y-1">
        {message.recommendations.slice(0, 3).map((rec, idx) => (
          <div key={idx} className="text-left">
            <Link
              href={`/book?treatment=${rec.id}`}
              className="inline-block text-xs rounded-md bg-secondary text-secondary-foreground px-2 py-1 hover:bg-secondary/80 transition"
            >
              Book {rec.name}
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
));

MessageComponent.displayName = 'MessageComponent';

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { 
      role: "bot", 
      text: "👋 Hi, I'm your Physiotherapy Assistant. Describe your problem or use the quick buttons below." 
    },
  ]);
  const [lastCategory, setLastCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ 
        top: scrollRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    }
  }, [messages, open]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Msg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: { lastCategory } }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      setLastCategory(data?.context?.lastCategory ?? lastCategory);

      let botText = data.bot as string;
      const botMsg: Msg = { 
        role: "bot", 
        text: botText, 
        cta: data.cta || null,
        recommendations: data.recommendations || []
      };

      setMessages(m => [...m, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Msg = {
        role: "bot",
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      };
      setMessages(m => [...m, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading, lastCategory]);

  const handleQuick = useCallback((q: string) => {
    if (q === "Start Consultation") return send("start");
    if (/Back Pain/i.test(q)) return send("symptom: back pain");
    if (/Neck Pain/i.test(q)) return send("symptom: neck stiffness");
    if (/Knee Pain/i.test(q)) return send("symptom: knee pain when walking");
    if (/Shoulder Pain/i.test(q)) return send("symptom: shoulder pain when lifting");
    if (/Posture/i.test(q)) return send("symptom: pain from sitting too long");
    return send(q);
  }, [send]);

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(v => !v)}
        className="fixed z-50 bottom-6 right-6 rounded-full p-4 shadow-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        aria-label="Open physiotherapy assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-[340px] md:w-[380px] h-[520px] z-50 rounded-2xl shadow-2xl bg-card border border-border flex flex-col"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">
                <Bot className="text-primary" size={20} />
                Physiotherapy Assistant
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="opacity-70 hover:opacity-100 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
              {messages.map((m, i) => (
                <MessageComponent key={i} message={m} index={i} />
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <Bot className="text-primary flex-shrink-0 mt-1" size={16} />
                  <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                    <Loader2 className="animate-spin h-4 w-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick buttons */}
            <div className="px-3 pb-2 flex gap-1 flex-wrap">
              {QUICK.map(q => (
                <button
                  key={q}
                  onClick={() => handleQuick(q)}
                  disabled={loading}
                  className="text-xs rounded-full px-2 py-1 bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = input;
                setInput("");
                send(t);
              }}
              className="p-3 border-t border-border flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here… (e.g., knee pain when walking)"
                disabled={loading}
                className="flex-1 rounded-lg px-3 py-2 bg-background border border-border text-sm disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg px-3 py-2 bg-primary text-primary-foreground text-sm disabled:opacity-50 hover:opacity-90 transition"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
