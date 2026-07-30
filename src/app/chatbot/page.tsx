'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { mockCustomers, mockHawkers, mockBills, mockCounterSales, mockReceipts, mockPublishers } from '@/lib/mockData';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: '🤖 Welcome to **PaperFlow Groq AI Intelligence**!\nI am your news agency assistant. Ask me anything about customer dues, hawker routes, sales, or bills in English or Hindi.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isLoading) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: prompt }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          agencyContext: {
            customers: mockCustomers,
            hawkers: mockHawkers,
            bills: mockBills,
            counterSales: mockCounterSales,
            receipts: mockReceipts,
            publishers: mockPublishers
          }
        })
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'Response generated.';
      setMessages([...newMsgs, { sender: 'bot', text: replyText }]);
    } catch (err: any) {
      setMessages([...newMsgs, { sender: 'bot', text: '⚠️ Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Show all customer dues (बकाया राशि)",
    "List all hawker routes",
    "Show today counter sales",
    "List all payment receipts",
    "Show publisher details"
  ];

  return (
    <div className="h-[calc(100vh-100px)] max-w-7xl mx-auto flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Agency AI Assistant (Groq LLM)</h2>
            <p className="text-xs text-indigo-200">Natural language reporting & query engine</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ sender: 'bot', text: 'Chat reset. How can I assist your news agency today?' }])}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'bot' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-xs font-medium'
                : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-xs font-medium'
            }`}>
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-500 text-xs italic">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Groq AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Chips */}
      <div className="px-6 py-3 bg-white border-t border-slate-100 flex flex-wrap gap-2">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition-colors font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Chatbot any agency question in English or Hindi..."
          className="flex-1 bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-medium"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </form>
    </div>
  );
}
