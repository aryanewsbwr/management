'use client';

import React, { useState } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Aryan News Agency - PaperFlow Pro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Modern Newspaper Transaction, Billing & Circulation Management" />
      </head>
      <body className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
            {children}
          </main>
        </div>
        {/* Floating Chatbot Button (Bottom-Right) */}
        <ChatbotWidget />
      </body>
    </html>
  );
}
