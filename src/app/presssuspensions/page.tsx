'use client';

import React, { useState } from 'react';
import { Scissors } from 'lucide-react';

const mockPublicationDiscontinues = [
  { pdisc_id: 1, publication_name: 'Dainik Bhaskar (दैनिक भास्कर)', from_date: '2026-08-15', to_date: '2026-08-15', reason: 'Independence Day Press Holiday' },
  { pdisc_id: 2, publication_name: 'Patrika (पत्रिका)', from_date: '2026-11-01', to_date: '2026-11-02', reason: 'Diwali Press Non-Publishing' }
];

export default function PressSuspensionsPage() {
  const [items, setItems] = useState(mockPublicationDiscontinues);

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-2">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-fuchsia-600" />
            <span>Option 11: Press Suspensions (अखबार प्रकाशन रोक)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage press non-printing suspension dates ({items.length} Records)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-800">
          <thead className="bg-slate-50 font-bold border-y border-slate-200 text-slate-600">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Publication</th>
              <th className="py-2.5 px-3">From Date</th>
              <th className="py-2.5 px-3">To Date</th>
              <th className="py-2.5 px-3">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {items.map((i) => (
              <tr key={i.pdisc_id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{i.pdisc_id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{i.publication_name}</td>
                <td className="py-2.5 px-3 text-slate-700">{i.from_date}</td>
                <td className="py-2.5 px-3 text-slate-700">{i.to_date}</td>
                <td className="py-2.5 px-3 text-slate-500">{i.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
