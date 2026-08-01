'use client';

import React, { useState } from 'react';
import { mockReceiptIssues } from '@/lib/mockData';
import { BookOpen } from 'lucide-react';

export default function ReceiptAllotmentPage() {
  const [items, setItems] = useState(mockReceiptIssues);

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-2">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            <span>Option 12: Receipt Book Allotment (रसीद बुक आवंटन)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage receipt book number ranges issued to payment collectors ({items.length} Records)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-800">
          <thead className="bg-slate-50 font-bold border-y border-slate-200 text-slate-600">
            <tr>
              <th className="py-2.5 px-3">Issue ID</th>
              <th className="py-2.5 px-3">Collector Name</th>
              <th className="py-2.5 px-3">Book No</th>
              <th className="py-2.5 px-3">Start Recp No</th>
              <th className="py-2.5 px-3">End Recp No</th>
              <th className="py-2.5 px-3">Issued Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {items.map((i) => (
              <tr key={i.issue_id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{i.issue_id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{i.collector_name}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{i.book_no || 'BK-01'}</td>
                <td className="py-2.5 px-3 font-mono text-slate-700">{i.start_no || i.receipt_from}</td>
                <td className="py-2.5 px-3 font-mono text-slate-700">{i.end_no || i.receipt_to}</td>
                <td className="py-2.5 px-3 text-slate-500">{i.issued_date || i.issue_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
