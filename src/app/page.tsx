'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  IndianRupee, 
  Store, 
  FileText, 
  ChevronRight,
  Plus,
  Building,
  Newspaper,
  MapPin,
  DollarSign,
  Calendar,
  ShoppingBag,
  Receipt,
  PauseCircle,
  Scissors,
  BookOpen,
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockCustomers, mockHawkers, mockCounterSales, mockPublications } from '@/lib/mockData';

const legacyFormsList = [
  { id: 1, name: 'Publisher Info', hindiName: 'प्रकाशक मास्टर', href: '/publications?tab=publishers', icon: Building, color: 'from-blue-600 to-indigo-600', badge: 'Screen 1' },
  { id: 2, name: 'Publication Info', hindiName: 'अखबार एवं दर मास्टर', href: '/publications?tab=active', icon: Newspaper, color: 'from-indigo-600 to-violet-600', badge: 'Screen 2' },
  { id: 3, name: 'Region Master', hindiName: 'क्षेत्र एवं जोन मास्टर', href: '/hawkers?tab=regions', icon: MapPin, color: 'from-purple-600 to-pink-600', badge: 'Screen 3' },
  { id: 4, name: 'Hawker Master', hindiName: 'हॉकर वितरण मास्टर', href: '/hawkers?tab=hawkers', icon: Truck, color: 'from-sky-600 to-blue-600', badge: 'Screen 4' },
  { id: 5, name: 'Customer Info', hindiName: 'ग्राहक मास्टर', href: '/customers?tab=customers', icon: Users, color: 'from-emerald-600 to-teal-600', badge: 'Screen 5' },
  { id: 6, name: 'Rate Changes Info', hindiName: 'दर परिवर्तन लॉग', href: '/publications?tab=ratechanges', icon: DollarSign, color: 'from-amber-600 to-orange-600', badge: 'Screen 6' },
  { id: 7, name: 'Define Holiday', hindiName: 'छुट्टी / प्रेस अवकाश', href: '/publications?tab=holidays', icon: Calendar, badge: 'Screen 7' },
  { id: 8, name: 'Purchase Invoice', hindiName: 'प्रेस स्टॉक खरीद', href: '/countersales?tab=purchases', icon: ShoppingBag, color: 'from-rose-600 to-red-600', badge: 'Screen 8' },
  { id: 9, name: 'Retail Sale Perm. Cust', hindiName: 'काउंटर नकद बिक्री', href: '/countersales?tab=sales', icon: Receipt, color: 'from-cyan-600 to-teal-600', badge: 'Screen 9' },
  { id: 10, name: 'Customer Discontinue', hindiName: 'ग्राहक छुट्टी वैकेशन', href: '/customers?tab=discontinue', icon: PauseCircle, color: 'from-yellow-600 to-amber-600', badge: 'Screen 10' },
  { id: 11, name: 'Publication Discontinue', hindiName: 'प्रेस रोक / निलंबन', href: '/publications?tab=suspensions', icon: Scissors, color: 'from-fuchsia-600 to-pink-600', badge: 'Screen 11' },
  { id: 12, name: 'Receipt Allotment', hindiName: 'रसीद बुक आवंटन', href: '/hawkers?tab=collectors', icon: BookOpen, color: 'from-teal-600 to-emerald-600', badge: 'Screen 12' },
  { id: 13, name: 'Payment Receipt Entry', hindiName: 'भुगतान रसीद प्रविष्टि', href: '/billing?tab=receipts', icon: CreditCard, color: 'from-emerald-600 to-green-600', badge: 'Screen 13' },
  { id: 14, name: 'Bill Processing Region', hindiName: 'क्षेत्र वार बिल जनरेशन', href: '/billing?tab=bills', icon: FileText, color: 'from-indigo-600 to-blue-600', badge: 'Screen 14' },
  { id: 15, name: 'Period Detail / Financial Year', hindiName: 'वित्तीय वर्ष चयन', href: '#', icon: Layers, color: 'from-slate-700 to-slate-900', badge: 'Screen 15' },
];

export default function Dashboard() {
  const totalDues = mockCustomers.reduce((sum, c) => sum + c.due_amount, 0);
  const todayCounterSales = mockCounterSales.reduce((sum, s) => sum + s.amt, 0);
  const totalCustomers = mockCustomers.length;
  const totalHawkers = mockHawkers.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Aryan News Agency Desktop Dashboard</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              15 Forms Ready
            </span>
          </div>
          <p className="text-xs text-slate-500">Click any form below to open the exact Visual Basic screen and start entries</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Customer Dues</p>
          <p className="text-xl font-black text-amber-600 mt-1">₹{totalDues.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-400 mt-1">Pending collections</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Today Sales</p>
          <p className="text-xl font-black text-emerald-600 mt-1">₹{todayCounterSales.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-400 mt-1">Counter sales</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Active Customers</p>
          <p className="text-xl font-black text-indigo-600 mt-1">{totalCustomers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Subscriptions</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Delivery Hawkers</p>
          <p className="text-xl font-black text-slate-800 mt-1">{totalHawkers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Assigned boys</p>
        </div>
      </div>

      {/* 15 Legacy Forms Direct Launcher Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Legacy Software Form Launcher (All 15 Screens)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">B:\himanshu uncle software layout</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {legacyFormsList.map((form) => {
            const Icon = form.icon;
            return (
              <Link
                key={form.id}
                href={form.href}
                className="group relative p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${form.color || 'from-indigo-600 to-indigo-500'} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {form.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {form.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{form.hindiName}</p>
                </div>

                <div className="flex items-center text-[10px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform pt-1 border-t border-slate-100">
                  <span>Open Form Window</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
