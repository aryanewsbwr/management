'use client';

import React, { useState } from 'react';
import { mockHolidays } from '@/lib/mockData';
import { Calendar, Plus, Save, Trash2, Edit } from 'lucide-react';

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState(mockHolidays);

  const aggregatedHolidays = Object.values(holidays.reduce((acc, curr) => {
    const key = `${curr.oc_date}_${curr.occasion}`;
    if (!acc[key]) {
      acc[key] = { ...curr, affected_pubs: [] };
    }
    if (curr.publication_name) {
      if (!acc[key].affected_pubs.includes(curr.publication_name)) {
        acc[key].affected_pubs.push(curr.publication_name);
      }
    }
    return acc;
  }, {} as Record<string, any>));

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-2">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Option 7: Define Holiday (त्यौहार / प्रेस छुट्टी)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage press non-publishing holidays ({aggregatedHolidays.length} Records)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-800">
          <thead className="bg-slate-50 font-bold border-y border-slate-200 text-slate-600">
            <tr>
              <th className="py-2.5 px-3">Holiday ID</th>
              <th className="py-2.5 px-3">Occasion / Event Name</th>
              <th className="py-2.5 px-3">Date (तारीख)</th>
              <th className="py-2.5 px-3">Affected Publication</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {aggregatedHolidays.map((h, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{h.holiday_id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{h.occasion === '1' ? 'General Holiday' : h.occasion}</td>
                <td className="py-2.5 px-3 text-indigo-600 font-bold">{h.oc_date}</td>
                <td className="py-2.5 px-3 text-slate-600">{h.affected_pubs.length > 0 ? h.affected_pubs.join(', ') : 'All Publications'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
