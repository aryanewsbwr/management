'use client';

import React, { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { mockReceipts, mockCustomers, mockCollectors } from '@/lib/mockData';
import { Receipt } from '@/lib/types';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    customer_id: 1,
    collect_id: 1,
    receipt_amount: 500,
    less_amount: 0,
    payment_mode: 'Cash' as const,
    remarks: 'Monthly Payment'
  });

  const totalCollected = receipts.reduce((sum, r) => sum + r.receipt_amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const custName = mockCustomers.find(c => c.customer_id === Number(form.customer_id))?.name_eng;
    const collectorName = mockCollectors.find(col => col.collect_id === Number(form.collect_id))?.name;

    const newReceipt: Receipt = {
      receipt_id: receipts.length + 101,
      receipt_no: `REC-2026-00${receipts.length + 1}`,
      customer_id: Number(form.customer_id),
      customer_name: custName,
      collect_id: Number(form.collect_id),
      collector_name: collectorName,
      receipt_date: new Date().toISOString().split('T')[0],
      bill_amount: Number(form.receipt_amount) + Number(form.less_amount),
      receipt_amount: Number(form.receipt_amount),
      less_amount: Number(form.less_amount),
      balance_amount: 0.00,
      payment_mode: form.payment_mode,
      remarks: form.remarks
    };

    setReceipts([newReceipt, ...receipts]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payment Receipts (भुगतान रसीद)</h1>
          <p className="text-xs text-slate-500">Record customer payment receipts collected by collectors or paid at office</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Payment Receipt</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">Total Collections</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{totalCollected.toLocaleString('en-IN')}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Receipts</h3>
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Receipt No</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Collector</th>
                <th className="p-3">Date</th>
                <th className="p-3">Mode</th>
                <th className="p-3 text-right">Received Amount</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {receipts.map((rec) => (
                <tr key={rec.receipt_id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-indigo-600">{rec.receipt_no}</td>
                  <td className="p-3 font-bold text-slate-900">{rec.customer_name}</td>
                  <td className="p-3 text-slate-500">{rec.collector_name || 'Office Counter'}</td>
                  <td className="p-3 text-slate-500">{rec.receipt_date}</td>
                  <td className="p-3 font-semibold text-slate-700">{rec.payment_mode}</td>
                  <td className="p-3 text-right font-black text-emerald-600">₹{rec.receipt_amount.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Collected
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base">Issue Payment Receipt</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Customer</label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                >
                  {mockCustomers.map(c => (
                    <option key={c.customer_id} value={c.customer_id}>{c.name_eng} (Due: ₹{c.due_amount})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bill Collector</label>
                <select
                  value={form.collect_id}
                  onChange={(e) => setForm({ ...form, collect_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                >
                  {mockCollectors.map(col => (
                    <option key={col.collect_id} value={col.collect_id}>{col.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    value={form.receipt_amount}
                    onChange={(e) => setForm({ ...form, receipt_amount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={form.payment_mode}
                    onChange={(e) => setForm({ ...form, payment_mode: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / PhonePe / GPay</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md"
                >
                  Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
