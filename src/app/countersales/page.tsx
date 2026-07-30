'use client';

import React, { useState } from 'react';
import { Store, Plus, IndianRupee, ShoppingBag, ShoppingCart } from 'lucide-react';
import { mockCounterSales, mockPublications, mockPurchases } from '@/lib/mockData';
import { CounterSale, Purchase } from '@/lib/types';

export default function CounterSalesPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales');
  const [sales, setSales] = useState<CounterSale[]>(mockCounterSales);
  const [purchases] = useState<Purchase[]>(mockPurchases);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    publication_id: 1,
    qty: 1,
    rate: 5.00,
    sale_date: new Date().toISOString().split('T')[0]
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.amt, 0);
  const totalCopiesSold = sales.reduce((sum, s) => sum + s.qty, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const pubName = mockPublications.find(p => p.publication_id === Number(form.publication_id))?.public_name;
    const amount = Number(form.qty) * Number(form.rate);

    const newSale: CounterSale = {
      sale_id: sales.length + 1,
      publication_id: Number(form.publication_id),
      publication_name: pubName,
      qty: Number(form.qty),
      rate: Number(form.rate),
      amt: amount,
      sale_date: form.sale_date
    };

    setSales([newSale, ...sales]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Counter Sales & Stock Purchases</h1>
          <p className="text-xs text-slate-500">Record daily over-the-counter retail sales & publisher stock invoices</p>
        </div>
        {activeTab === 'sales' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Retail Sale</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'sales'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Counter Sales</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'purchases'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Publisher Stock Purchases</span>
        </button>
      </div>

      {/* Tab 1: Counter Sales */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Counter Revenue</p>
                <h3 className="text-xl font-black text-emerald-600 mt-1">₹{totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <IndianRupee className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Copies Sold</p>
                <h3 className="text-xl font-black text-indigo-600 mt-1">{totalCopiesSold}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Sales Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Sale ID</th>
                    <th className="py-2 px-3">Sale Date</th>
                    <th className="py-2 px-3">Publication</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Rate</th>
                    <th className="py-2 px-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sales.map((sale) => (
                    <tr key={sale.sale_id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">#SALE-{sale.sale_id}</td>
                      <td className="py-2 px-3 text-slate-500">{sale.sale_date}</td>
                      <td className="py-2 px-3 font-bold text-indigo-600">{sale.publication_name}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{sale.qty}</td>
                      <td className="py-2 px-3 text-right">₹{sale.rate.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-600">₹{sale.amt.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Publisher Stock Purchases */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {purchases.map((pur) => (
            <div key={pur.purchase_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {pur.bill_no}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{pur.publisher_name}</h3>
                  <p className="text-[11px] text-slate-500">Bill Date: {pur.bill_date} • Received: {pur.r_date}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block font-medium">Net Amount</span>
                  <span className="text-base font-black text-emerald-600">₹{pur.net_amt.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {pur.items && pur.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-slate-50 font-semibold text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-1.5 px-3">Publication</th>
                        <th className="py-1.5 px-3 text-center">Purchased Qty</th>
                        <th className="py-1.5 px-3 text-right">Wholesale Rate</th>
                        <th className="py-1.5 px-3 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {pur.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-bold text-slate-900">{item.publication_name}</td>
                          <td className="py-2 px-3 text-center font-bold text-indigo-600">{item.qty}</td>
                          <td className="py-2 px-3 text-right">₹{item.rate.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">₹{item.amt.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <h3 className="font-bold text-sm">Record Counter Retail Sale</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Publication</label>
                <select
                  value={form.publication_id}
                  onChange={(e) => setForm({ ...form, publication_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                >
                  {mockPublications.map(p => (
                    <option key={p.publication_id} value={p.publication_id}>{p.public_name} ({p.abrv})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Sale Date</label>
                <input
                  type="date"
                  value={form.sale_date}
                  onChange={(e) => setForm({ ...form, sale_date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
