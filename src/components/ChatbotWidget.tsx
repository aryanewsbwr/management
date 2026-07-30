'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, X, MessageSquare, Loader2 } from 'lucide-react';
import { mockCustomers, mockHawkers, mockBills, mockCounterSales, mockReceipts, mockPublishers } from '@/lib/mockData';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am your **Groq AI Agency Assistant**.\nAsk me anything about customer dues, hawker routes, sales, or bills in English or Hindi!'
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
      setMessages([...newMsgs, { sender: 'bot', text: '⚠️ Connection issue. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Show all customer dues (बकाया राशि)",
    "List hawker routes",
    "Today counter sales",
    "Payment receipts"
  ];

  return (
    <>
      {/* Floating Bottom-Right Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 z-50 group border-2 border-white"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full"></span>
          </div>
        )}
      </button>

      {/* Floating Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-22 right-5 w-96 max-w-[92vw] h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">PaperFlow AI Assistant</h3>
                <p className="text-[11px] text-indigo-100 font-medium">Powered by Groq LLM (Live)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Thinking answer...</span>
              </div>
            )}
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI anything (dues, sales, hawkers)..."
              className="flex-1 bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
