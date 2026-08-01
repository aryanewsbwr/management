'use client';

import React, { useState } from 'react';
import { PauseCircle, Plus, Save, Trash2 } from 'lucide-react';

const mockDiscontinueLogs = [
  { disc_id: 1, customer_name: 'Sharma Ji (शर्मा जी)', disc_type: 'Temporary (वैकेशन)', start_date: '2026-08-05', end_date: '2026-08-15', reason: 'Out of Town / गाँव जाना' },
  { disc_id: 2, customer_name: 'Verma Traders (वर्मा ट्रेडर्स)', disc_type: 'Permanent (बंद)', start_date: '2026-07-01', end_date: 'N/A', reason: 'Shifted Residence / दुकान ट्रांसफर' }
];

export default function DiscontinuePage() {
  const [logs, setLogs] = useState(mockDiscontinueLogs);

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-2">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <PauseCircle className="w-5 h-5 text-yellow-600" />
            <span>Option 10: Discontinue Info (ग्राहक वैकेशन स्टॉप)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage customer vacation holds & temporary stops ({logs.length} Records)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-800">
          <thead className="bg-slate-50 font-bold border-y border-slate-200 text-slate-600">
            <tr>
              <th className="py-2.5 px-3">Log ID</th>
              <th className="py-2.5 px-3">Customer Name</th>
              <th className="py-2.5 px-3">Stop Type</th>
              <th className="py-2.5 px-3">Start Date</th>
              <th className="py-2.5 px-3">End Date</th>
              <th className="py-2.5 px-3">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {logs.map((l) => (
              <tr key={l.disc_id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{l.disc_id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{l.customer_name}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    l.disc_type.includes('Temporary') ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {l.disc_type}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-700">{l.start_date}</td>
                <td className="py-2.5 px-3 text-slate-700">{l.end_date}</td>
                <td className="py-2.5 px-3 text-slate-500">{l.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
