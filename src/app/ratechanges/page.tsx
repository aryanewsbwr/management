'use client';

import React, { useState } from 'react';
import { mockPublicationRates, mockPublications } from '@/lib/mockData';
import { DollarSign, Save, Edit, Trash2, X, Plus } from 'lucide-react';

export default function RateChangesPage() {
  const [rates, setRates] = useState(mockPublicationRates);

  // Group rates by publication_id so we have one row per publication
  const aggregatedRates = Object.values(rates.reduce((acc, curr) => {
    if (!acc[curr.publication_id]) {
      const pubName = mockPublications.find(p => p.publication_id === curr.publication_id)?.public_name || `Unknown Pub #${curr.publication_id}`;
      acc[curr.publication_id] = {
        publication_id: curr.publication_id,
        publication_name: pubName,
        rate_mon: 0, rate_tue: 0, rate_wed: 0, rate_thu: 0, rate_fri: 0, rate_sat: 0, rate_sun: 0
      };
    }
    const day = curr.day_of_week;
    const rate = curr.rate ?? 0;
    if (day === 1) acc[curr.publication_id].rate_mon = rate;
    if (day === 2) acc[curr.publication_id].rate_tue = rate;
    if (day === 3) acc[curr.publication_id].rate_wed = rate;
    if (day === 4) acc[curr.publication_id].rate_thu = rate;
    if (day === 5) acc[curr.publication_id].rate_fri = rate;
    if (day === 6) acc[curr.publication_id].rate_sat = rate;
    if (day === 7) acc[curr.publication_id].rate_sun = rate;
    return acc;
  }, {} as Record<number, any>));

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-2">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <span>Option 6: Rate Changes Info (अखबार दर परिवर्तन लॉग)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage daily rates for all active publications ({aggregatedRates.length} Records)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-800">
          <thead className="bg-slate-50 font-bold border-y border-slate-200 text-slate-600">
            <tr>
              <th className="py-2.5 px-3">Publication</th>
              <th className="py-2.5 px-3">Mon (सोम)</th>
              <th className="py-2.5 px-3">Tue (मंगल)</th>
              <th className="py-2.5 px-3">Wed (बुध)</th>
              <th className="py-2.5 px-3">Thu (गुरु)</th>
              <th className="py-2.5 px-3">Fri (शुक्र)</th>
              <th className="py-2.5 px-3">Sat (शनि)</th>
              <th className="py-2.5 px-3">Sun (रवि)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {aggregatedRates.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-900">{r.publication_name}</td>
                <td className="py-2.5 px-3">₹{(r.rate_mon).toFixed(2)}</td>
                <td className="py-2.5 px-3">₹{(r.rate_tue).toFixed(2)}</td>
                <td className="py-2.5 px-3">₹{(r.rate_wed).toFixed(2)}</td>
                <td className="py-2.5 px-3">₹{(r.rate_thu).toFixed(2)}</td>
                <td className="py-2.5 px-3">₹{(r.rate_fri).toFixed(2)}</td>
                <td className="py-2.5 px-3 font-bold text-indigo-600">₹{(r.rate_sat).toFixed(2)}</td>
                <td className="py-2.5 px-3 font-bold text-rose-600">₹{(r.rate_sun).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
