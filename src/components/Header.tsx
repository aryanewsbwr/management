'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ 
  title, 
  onToggleSidebar 
}: { 
  title?: string; 
  onToggleSidebar: () => void;
}) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-slate-900">
          {title || 'Agency Overview'}
        </h1>
      </div>
    </header>
  );
}
