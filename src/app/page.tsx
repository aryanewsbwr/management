'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Truck, 
  IndianRupee, 
  Store, 
  FileText, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { mockCustomers, mockHawkers, mockCounterSales, mockPublications } from '@/lib/mockData';

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
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500">Newspaper transactions, hawkers & monthly dues</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/customers"
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </Link>
          <Link
            href="/billing"
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Monthly Bills</span>
          </Link>
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

      {/* Clean Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unpaid Dues List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Unpaid Customer Dues</h2>
            <Link href="/billing" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3 text-right">Due</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {mockCustomers.filter(c => c.due_amount > 0).map((cust) => (
                  <tr key={cust.customer_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {cust.name_eng}
                      {cust.name_hindi && <span className="block text-[11px] text-slate-400 font-normal">{cust.name_hindi}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{cust.region_name}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-600">₹{cust.due_amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Unpaid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Papers Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Active Publications</h2>
          <div className="space-y-2">
            {mockPublications.map((pub) => (
              <div key={pub.publication_id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{pub.public_name}</p>
                  <p className="text-[11px] text-slate-500">{pub.pub_hindi} • {pub.type_p}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                  {pub.abrv}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
