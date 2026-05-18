"use client";

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Terminal } from 'lucide-react';

export default function ChatDashboard({ name }: { name: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "agent", content: `Greetings! I am the specialized Swarm bot for ${name}. Ingest your query, and I will route it dynamically to the corresponding microservices.` }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: "user", content: userMsg }]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        sender: "agent",
        content: `Triaged request: "${userMsg}". Vector index returned 3 matching document nodes. Prompt completions resolved in 140ms. Code bases fully updated!`
      }]);
    }, 1200);
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-[500px] text-zinc-100 font-sans select-none rounded-[2rem] border border-white/5 m-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-base font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Conversational Hub: {name}
            </h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Multi-Agent Sandbox Interface</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight font-mono">Ollama + Groq</span>
          </div>
        </header>

        {/* Chat Window */}
        <div className="border border-white/5 rounded-3xl bg-zinc-900/30 p-5 flex flex-col justify-between h-[350px] shadow-2xl relative">
          
          {/* Scroll Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                  msg.sender === 'user' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  msg.sender === 'user' ? 'bg-purple-950/10 border-purple-500/25 text-zinc-200' : 'bg-white/[0.01] border-white/5 text-zinc-300'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Thinking Overlay indicator */}
            {isThinking && (
              <div className="flex gap-3 max-w-[80%] animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.01] text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple-500 rounded-full animate-ping" />
                  Agent Swarm compiling context embeddings...
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="mt-3 flex items-center bg-black border border-white/10 rounded-2xl p-1 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query custom model, command database, or draft code..." 
              className="border-none bg-transparent focus:ring-0 text-white placeholder:text-zinc-700 text-xs h-9 flex-1 px-3 outline-none"
            />
            <button 
              type="submit" 
              className="h-8 w-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
