'use client';

import React, { useState } from 'react';
import { BarChart3, Printer, Truck, Users, FileText, Calendar, Filter, Tag, Download, Check } from 'lucide-react';
import { mockCustomers, mockCustomerDetails, mockPublications, mockHawkers, mockRegions, mockCollectors, mockBills } from '@/lib/mockData';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<
    'hawker_sheet' | 'priority_report' | 'stickers' | 'collector_dues' | 'customer_dues' | 'region_sales' | 'discontinue' | 'qty_report' | 'counter_report'
  >('hawker_sheet');

  const [selectedHawker, setSelectedHawker] = useState<number>(1);
  const [selectedRegion, setSelectedRegion] = useState<number | 'ALL'>('ALL');
  const [selectedCollector, setSelectedCollector] = useState<number | 'ALL'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState(2026);

  // Sticker print preview state
  const [stickerCols, setStickerCols] = useState(3);

  // 1. Hawker Daily Distribution Sheet
  const activeHawker = mockHawkers.find(h => h.hawker_id === selectedHawker) || mockHawkers[0];
  const hawkerSubs = mockCustomerDetails.filter(d => d.hawker_id === selectedHawker);
  
  const publicationTotals = mockPublications.map(pub => {
    const pubSubs = hawkerSubs.filter(s => s.publication_id === pub.publication_id);
    const totalQty = pubSubs.reduce((sum, s) => sum + s.qty, 0);
    return { publication_name: pub.public_name, totalQty };
  }).filter(p => p.totalQty > 0);

  // 2. Customer Priority Delivery List
  const priorityList = mockCustomers
    .filter(c => selectedRegion === 'ALL' || c.region_id === Number(selectedRegion))
    .sort((a, b) => a.priority - b.priority);

  // 3. Address Sticker Printing List
  const stickerCustomers = mockCustomers.filter(c => selectedRegion === 'ALL' || c.region_id === Number(selectedRegion));

  // 4. Collector Dues Report
  const collectorReport = mockCollectors.map(col => {
    const colBills = mockBills.filter(b => b.status === 'Unpaid');
    const totalDues = colBills.reduce((sum, b) => sum + b.net_payable, 0);
    return { ...col, totalDues, count: colBills.length };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Agency Reports & Label Printing</h1>
          <p className="text-xs text-slate-500">Generate hawker daily sheets, delivery priority lists, address stickers & dues ledgers</p>
        </div>
        
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer no-print"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>
      </div>

      {/* Report Type Selector Tabs (Matching all reports in decompiled VB6 EXE) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-print">
        <button
          onClick={() => setSelectedReport('hawker_sheet')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedReport === 'hawker_sheet' ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Hawker Daily Sheet</span>
        </button>

        <button
          onClick={() => setSelectedReport('priority_report')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedReport === 'priority_report' ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Priority Delivery Route</span>
        </button>

        <button
          onClick={() => setSelectedReport('stickers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedReport === 'stickers' ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Sticker Label Printing</span>
        </button>

        <button
          onClick={() => setSelectedReport('collector_dues')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedReport === 'collector_dues' ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Collector Dues Report</span>
        </button>

        <button
          onClick={() => setSelectedReport('customer_dues')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedReport === 'customer_dues' ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Region Dues Ledger</span>
        </button>
      </div>

      {/* REPORT 1: Hawker Daily Distribution Sheet */}
      {selectedReport === 'hawker_sheet' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 no-print">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Select Hawker:</label>
              <select
                value={selectedHawker}
                onChange={(e) => setSelectedHawker(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                {mockHawkers.map(h => (
                  <option key={h.hawker_id} value={h.hawker_id}>{h.name} ({h.region_name || 'Route'})</option>
                ))}
              </select>
            </div>

            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
              Date: {new Date().toLocaleDateString('en-IN')}
            </span>
          </div>

          {/* Printable Header */}
          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase">Aryan News Agency - Hawker Supply Sheet</h2>
            <p className="text-xs font-bold text-indigo-700">Hawker: {activeHawker.name} | Mobile: {activeHawker.mobile || 'N/A'}</p>
          </div>

          {/* Summary Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Total Copy Summary (अखबार बंडल कुल):</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {publicationTotals.map((tot, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <p className="font-bold text-slate-700">{tot.publication_name}</p>
                  <p className="text-lg font-black text-indigo-600 mt-0.5">{tot.totalQty} Copies</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Delivery List */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer Delivery Route List:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Seq</th>
                    <th className="py-2 px-3">Customer Name</th>
                    <th className="py-2 px-3">Address</th>
                    <th className="py-2 px-3">Subscribed Paper</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {hawkerSubs.map((sub, idx) => {
                    const cust = mockCustomers.find(c => c.customer_id === sub.customer_id);
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-indigo-600">#{cust?.priority || idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{cust?.name_eng} ({cust?.name_hindi})</td>
                        <td className="py-2 px-3 text-slate-600">{cust?.add1}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{sub.publication_name}</td>
                        <td className="py-2 px-3 text-center font-black text-indigo-700">{sub.qty}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: Hawker's Customer Priority Report */}
      {selectedReport === 'priority_report' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Filter Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="ALL">All Regions</option>
                {mockRegions.map(r => (
                  <option key={r.region_id} value={r.region_id}>{r.region_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase">Hawker's Customer Priority Route Report</h2>
            <p className="text-xs text-slate-500">Sorted by Route Priority Number for optimal delivery sequence</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Priority #</th>
                  <th className="py-2 px-3">Customer Name</th>
                  <th className="py-2 px-3">Hindi Name</th>
                  <th className="py-2 px-3">Address</th>
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3">Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {priorityList.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-black text-indigo-600">Priority #{c.priority}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.name_eng}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">{c.name_hindi || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.add1}</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.region_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: Sticker Label Printing Report */}
      {selectedReport === 'stickers' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 no-print">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Filter Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="ALL">All Regions</option>
                {mockRegions.map(r => (
                  <option key={r.region_id} value={r.region_id}>{r.region_name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Grid Columns:</label>
              <select
                value={stickerCols}
                onChange={(e) => setStickerCols(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
              >
                <option value={2}>2 Labels / Row</option>
                <option value={3}>3 Labels / Row</option>
                <option value={4}>4 Labels / Row</option>
              </select>
            </div>
          </div>

          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase">Customer Address Sticker Label Printing</h2>
            <p className="text-xs text-slate-500">Ready for adhesive sticker paper sheets or envelope mailers</p>
          </div>

          {/* Sticker Grid */}
          <div className={`grid gap-3 ${
            stickerCols === 2 ? 'grid-cols-2' : stickerCols === 4 ? 'grid-cols-4' : 'grid-cols-3'
          }`}>
            {stickerCustomers.map((c) => (
              <div key={c.customer_id} className="p-3 rounded-lg border-2 border-dashed border-slate-300 bg-white space-y-1 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-[10px] text-indigo-700">ARYAN NEWS AGENCY</span>
                  <span className="font-bold text-[10px] text-slate-400">#{c.customer_id}</span>
                </div>
                <p className="font-black text-slate-900 text-sm">{c.name_eng}</p>
                {c.name_hindi && <p className="font-bold text-slate-700 text-xs">{c.name_hindi}</p>}
                <p className="text-slate-600 text-[11px] leading-tight">{c.add1} {c.hindi_add ? `(${c.hindi_add})` : ''}</p>
                <p className="text-[10px] font-bold text-slate-500 pt-0.5">{c.region_name} • Ph: {c.phone || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT 4: Collection Agent Dues Report */}
      {selectedReport === 'collector_dues' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase">Collection Agent Dues & Outstanding Report</h2>
            <p className="text-xs text-slate-500">Collector-wise assigned bill collections and total due balances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectorReport.map((col) => (
              <div key={col.collect_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{col.name}</h3>
                    <p className="text-xs text-slate-500">Office: {col.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Assigned Dues</span>
                    <span className="text-base font-black text-amber-600">₹{col.totalDues.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium flex items-center justify-between">
                  <span>Phone: {col.phone}</span>
                  <span className="font-bold text-indigo-600">{col.count} Unpaid Bills Assigned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT 5: Customer Dues Ledger */}
      {selectedReport === 'customer_dues' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase">Customer Outstanding Dues Ledger</h2>
            <p className="text-xs text-slate-500">Complete list of unpaid customer balances</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Cust ID</th>
                  <th className="py-2 px-3">Customer Name</th>
                  <th className="py-2 px-3">Hindi Name</th>
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3 text-right">Outstanding Dues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {mockCustomers.filter(c => c.due_amount > 0).map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-indigo-600">#CUST-{c.customer_id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.name_eng}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">{c.name_hindi || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.region_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.phone || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-right font-black text-amber-600">₹{c.due_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
