'use client';

import React from 'react';
import './globals.css';
import Header from '@/components/Header';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Aryan News Agency - 2008 Desktop Edition</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Aryan News Agency Newspaper Circulation & Billing Software" />
      </head>
      <body className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">
        {/* Top Desktop Dropdown Navigation Header */}
        <Header />

        {/* Main Content Full Width Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          {children}
        </main>

        {/* Floating AI Assistant Button (Bottom-Right) */}
        <ChatbotWidget />
      </body>
    </html>
  );
}
