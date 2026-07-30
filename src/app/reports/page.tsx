'use client';

import React, { useState } from 'react';
import { Printer, Truck, Users, IndianRupee } from 'lucide-react';
import { mockHawkers, mockCustomerDetails, mockCustomers, mockCounterSales } from '@/lib/mockData';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'hawker' | 'dues' | 'sales'>('hawker');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Agency Reports (रिपोर्ट)</h1>
          <p className="text-xs text-slate-500">Hawker daily distribution sheets, customer dues, and counter sales logs</p>
        </div>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start md:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Current Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 no-print overflow-x-auto">
        <button
          onClick={() => setActiveTab('hawker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'hawker'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Hawker Daily Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('dues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'dues'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Dues</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'sales'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Counter Sales Summary</span>
        </button>
      </div>

      {/* Hawker Sheet */}
      {activeTab === 'hawker' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Hawker Daily Distribution Sheet</h3>
            <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="space-y-4">
            {mockHawkers.map((hawker) => {
              const hawkerSubs = mockCustomerDetails.filter(d => d.hawker_id === hawker.hawker_id);
              const totalCopies = hawkerSubs.reduce((sum, s) => sum + s.qty, 0);

              return (
                <div key={hawker.hawker_id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{hawker.name}</h4>
                      <p className="text-xs text-indigo-600 font-semibold">Region: {hawker.region_name} • Phone: {hawker.mobile}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Total Deliveries: {totalCopies} copies
                    </span>
                  </div>

                  <table className="w-full text-xs text-left text-slate-700 border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Customer</th>
                        <th className="p-2.5">Publication</th>
                        <th className="p-2.5 text-center">Copies</th>
                        <th className="p-2.5">Circulation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {hawkerSubs.map((sub) => {
                        const cust = mockCustomers.find(c => c.customer_id === sub.customer_id);
                        return (
                          <tr key={sub.sno}>
                            <td className="p-2.5 font-bold text-slate-900">{cust?.name_eng} ({cust?.name_hindi || ''})</td>
                            <td className="p-2.5 text-indigo-600">{sub.publication_name}</td>
                            <td className="p-2.5 text-center font-bold text-slate-900">{sub.qty}</td>
                            <td className="p-2.5 text-slate-500">{sub.circulation}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dues */}
      {activeTab === 'dues' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Outstanding Customer Dues Report</h3>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-right">Outstanding Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {mockCustomers.filter(c => c.due_amount > 0).map((c) => (
                  <tr key={c.customer_id}>
                    <td className="p-3 font-bold text-indigo-600">#CUST-{c.customer_id}</td>
                    <td className="p-3 font-bold text-slate-900">{c.name_eng} ({c.name_hindi || ''})</td>
                    <td className="p-3 text-slate-500">{c.region_name}</td>
                    <td className="p-3 text-slate-500">{c.phone || 'N/A'}</td>
                    <td className="p-3 text-right font-black text-amber-600">₹{c.due_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales */}
      {activeTab === 'sales' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Counter Sales Summary Log</h3>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Publication</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {mockCounterSales.map((s) => (
                  <tr key={s.sale_id}>
                    <td className="p-3 text-slate-500">{s.sale_date}</td>
                    <td className="p-3 font-bold text-slate-900">{s.publication_name}</td>
                    <td className="p-3 text-center font-bold text-indigo-600">{s.qty}</td>
                    <td className="p-3 text-right">₹{s.rate.toFixed(2)}</td>
                    <td className="p-3 text-right font-black text-emerald-600">₹{s.amt.toFixed(2)}</td>
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
