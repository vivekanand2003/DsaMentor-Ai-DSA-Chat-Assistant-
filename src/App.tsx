import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Trash2, Loader2, Code2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
};

const SYSTEM_INSTRUCTION = `You are a Data Structure and Algorithm (DSA) instructor who explains concepts clearly, simply, and logically — like a good teacher.

RESPONSE STYLE:

For DSA questions:
- Explain in very clear, simple, beginner-friendly language.
- Use short sentences and easy words.
- Break ideas into small logical steps.
- Use relatable everyday examples when helpful.
- Avoid unnecessary jargon.
- Use clean formatting.
- Provide small code examples only when useful.

If the user asks for more depth using words like:
"detail", "deep", "full", "in depth", "advanced", "elaborate", "complete":

Then switch to a detailed explanation:
- full concept clarity
- step-by-step reasoning
- complexity analysis
- edge cases
- proper code examples

STRICT TOPIC RULE:
If the question is related to DSA (arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, recursion, dynamic programming, complexity, etc.) → answer normally using the style above.

If the question is NOT related to DSA:
Reply rudely, dismissively, and sarcastically.
Tell the user to stop asking irrelevant things and focus on algorithms.
Be strict about this boundary.

Always follow these rules.`;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: input.trim() }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const modelMessage: Message = {
        role: 'model',
        content: response.text || "I'm speechless... (or maybe there was an error).",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        role: 'model',
        content: "Error: Failed to connect to the algorithm mainframe. Check your connection or API key.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto border-x border-brand-primary/20 bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-brand-primary/10 bg-brand-primary text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-accent/20 rounded-lg">
            <Bot className="w-6 h-6 text-brand-accent" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg tracking-tight uppercase">Dsa-Mentor-Ai</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
              System Online // DSA_ONLY
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          title="Clear Buffer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F8F7] scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40"
            >
              <Terminal className="w-12 h-12" />
              <div className="space-y-1">
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting Input...</p>
                <p className="text-xs italic">"Ask me about Big O, Linked Lists, or DP. Don't waste my time."</p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={msg.timestamp + idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' ? "bg-brand-primary text-white" : "bg-brand-accent/10 text-brand-primary border border-brand-accent/20"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
              </div>
              
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl shadow-sm",
                msg.role === 'user' 
                  ? "bg-brand-primary text-white rounded-tr-none" 
                  : "bg-white border border-brand-primary/5 rounded-tl-none"
              )}>
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
                <div className={cn(
                  "mt-2 text-[10px] font-mono opacity-40",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
              </div>
              <div className="bg-white border border-brand-primary/5 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-brand-primary/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-brand-primary/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <footer className="p-4 border-t border-brand-primary/10 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query algorithm database..."
            className="flex-1 bg-[#F0F0EF] border-none rounded-xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all pr-12"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 p-2 rounded-lg transition-all",
              input.trim() && !isLoading 
                ? "bg-brand-primary text-white hover:bg-black" 
                : "bg-transparent text-black/20"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-2 flex justify-between items-center px-1">
          <p className="text-[9px] font-mono text-black/40 uppercase tracking-tighter">
            Input_Buffer: {input.length} chars // Status: {isLoading ? 'Processing' : 'Ready'}
          </p>
          <p className="text-[9px] font-mono text-black/40 uppercase tracking-tighter">
            Gemini-2.5-Flash-Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
