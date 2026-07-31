'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  FileText, 
  ShoppingBag,
  BarChart3,
  X,
  Newspaper,
  BookOpen,
  Calendar,
  DollarSign,
  Receipt,
  Layers,
  PauseCircle,
  Scissors,
  Tag,
  CreditCard,
  Building,
  MapPin,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const menuGroups = [
  {
    title: 'MASTER DIRECTORIES',
    items: [
      { name: 'Publisher Info (Sc. 1)', href: '/publications?tab=publishers', icon: Building, badge: 'Sc 1' },
      { name: 'Publication Info (Sc. 2)', href: '/publications?tab=active', icon: Newspaper, badge: 'Sc 2' },
      { name: 'Region Details (Sc. 3)', href: '/hawkers?tab=regions', icon: MapPin, badge: 'Sc 3' },
      { name: 'Hawker Details (Sc. 4)', href: '/hawkers?tab=hawkers', icon: Truck, badge: 'Sc 4' },
      { name: 'Customer Info (Sc. 5)', href: '/customers?tab=customers', icon: Users, badge: 'Sc 5' },
      { name: 'Rate Changes Info (Sc. 6)', href: '/publications?tab=ratechanges', icon: DollarSign, badge: 'Sc 6' },
      { name: 'Define Holiday (Sc. 7)', href: '/publications?tab=holidays', icon: Calendar, badge: 'Sc 7' },
    ]
  },
  {
    title: 'TRANSACTIONS & ENTRY',
    items: [
      { name: 'Purchase Stock (Sc. 8)', href: '/countersales?tab=purchases', icon: ShoppingBag, badge: 'Sc 8' },
      { name: 'Retail Sale Perm. Cust (Sc. 9)', href: '/countersales?tab=sales', icon: Receipt, badge: 'Sc 9' },
      { name: 'Customer Discontinue (Sc. 10)', href: '/customers?tab=discontinue', icon: PauseCircle, badge: 'Sc 10' },
      { name: 'Publication Discontinue (Sc. 11)', href: '/publications?tab=suspensions', icon: Scissors, badge: 'Sc 11' },
      { name: 'Receipt Allotment (Sc. 12)', href: '/hawkers?tab=collectors', icon: BookOpen, badge: 'Sc 12' },
      { name: 'Payment Receipt Entry (Sc. 13)', href: '/billing?tab=receipts', icon: CreditCard, badge: 'Sc 13' },
      { name: 'Bill Processing Region (Sc. 14)', href: '/billing?tab=bills', icon: FileText, badge: 'Sc 14' },
    ]
  },
  {
    title: 'REPORTS & PRINTING',
    items: [
      { name: 'Hawker Daily Sheet', href: '/reports?tab=hawker_sheet', icon: Truck, badge: 'Report' },
      { name: 'Address Sticker Printing', href: '/reports?tab=stickers', icon: Tag, badge: 'Stickers' },
      { name: 'Collector Dues Ledger', href: '/reports?tab=collector_dues', icon: BarChart3, badge: 'Ledger' },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 
        flex flex-col h-screen z-50 transition-transform duration-200 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-white text-xs tracking-wide uppercase block">Aryan News Agency</span>
              <span className="text-[10px] text-slate-400 font-medium">All 15 Legacy Screens</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Direct Link */}
        <div className="p-3 border-b border-slate-800">
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              pathname === '/' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </Link>
        </div>

        {/* Full 15 Screens Navigation Groups */}
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-black text-indigo-400 tracking-wider uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname + (window?.location?.search || '') === item.href || pathname === item.href.split('?')[0];

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <span>VB6 Migration v2.0</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            15/15 Ready
          </span>
        </div>
      </aside>
    </>
  );
}
