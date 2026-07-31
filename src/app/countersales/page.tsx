'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Store, Plus, IndianRupee, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import { mockCounterSales, mockPublications, mockPurchases, mockPublishers } from '@/lib/mockData';
import { CounterSale, Purchase, PurchaseDetail } from '@/lib/types';

function CounterSalesContent() {
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const initialTab = tabQuery === 'purchases' ? 'purchases' : 'sales';

  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>(initialTab);
  const [sales, setSales] = useState<CounterSale[]>(mockCounterSales);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);

  // Counter Retail Sale Form State (Matching Screenshot 9)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    customer_name: 'Walk-in Customer',
    sale_date: new Date().toISOString().split('T')[0],
    period: '2026-2027',
    publication_id: 1,
    qty: 1,
    rate: 5.00,
    narration: 'OTC Retail Cash Sale'
  });

  // Wholesale Press Purchase Form State (Matching Screenshot 8)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    publisher_id: 1,
    bill_no: 'INV-DB-9001',
    bill_date: new Date().toISOString().split('T')[0],
    r_date: new Date().toISOString().split('T')[0],
    publication_id: 1,
    qty: 100,
    rate: 4.20,
    add_less: 0.00,
    items: [] as PurchaseDetail[]
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.amt, 0);
  const totalCopiesSold = sales.reduce((sum, s) => sum + s.qty, 0);

  const handleAddRetailSale = (e: React.FormEvent) => {
    e.preventDefault();
    const pubName = mockPublications.find(p => p.publication_id === Number(saleForm.publication_id))?.public_name;
    const amount = Number(saleForm.qty) * Number(saleForm.rate);

    const newSale: CounterSale = {
      sale_id: sales.length + 1,
      publication_id: Number(saleForm.publication_id),
      publication_name: pubName,
      qty: Number(saleForm.qty),
      rate: Number(saleForm.rate),
      amt: amount,
      sale_date: saleForm.sale_date,
      period: saleForm.period,
      customer_name: saleForm.customer_name,
      narration: saleForm.narration
    };

    setSales([newSale, ...sales]);
    setIsSaleModalOpen(false);
  };

  const handleAddPurchaseItem = () => {
    const pubName = mockPublications.find(p => p.publication_id === Number(purchaseForm.publication_id))?.public_name;
    const amount = Number(purchaseForm.qty) * Number(purchaseForm.rate);

    const newItem: PurchaseDetail = {
      publication_id: Number(purchaseForm.publication_id),
      publication_name: pubName,
      qty: Number(purchaseForm.qty),
      rate: Number(purchaseForm.rate),
      amt: amount
    };

    setPurchaseForm(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const pubName = mockPublishers.find(p => p.publisher_id === Number(purchaseForm.publisher_id))?.name;
    const itemsTotal = purchaseForm.items.reduce((sum, i) => sum + i.amt, 0);
    const net = itemsTotal + Number(purchaseForm.add_less);

    const newPurchase: Purchase = {
      purchase_id: purchases.length + 1,
      publisher_id: Number(purchaseForm.publisher_id),
      publisher_name: pubName,
      bill_no: purchaseForm.bill_no,
      bill_date: purchaseForm.bill_date,
      r_date: purchaseForm.r_date,
      total: itemsTotal,
      add_less: Number(purchaseForm.add_less),
      net_amt: net,
      items: purchaseForm.items
    };

    setPurchases([newPurchase, ...purchases]);
    setIsPurchaseModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Counter Sales & Stock Purchases</h1>
          <p className="text-xs text-slate-500">Retail sales to permanent/walk-in customers & wholesale publisher stock invoices</p>
        </div>
        {activeTab === 'sales' ? (
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Retail Sale (Screenshot 9)</span>
          </button>
        ) : (
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Stock Purchase (Screenshot 8)</span>
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
          <span>Retail Sale to Permanent Customer</span>
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

      {/* Tab 1: Counter Sales (Screenshot 9) */}
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
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Retail Sales Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Sale ID</th>
                    <th className="py-2 px-3">Date & Period</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Publication</th>
                    <th className="py-2 px-3 text-center">Copies</th>
                    <th className="py-2 px-3 text-right">Rate</th>
                    <th className="py-2 px-3 text-right">Rec.Amt</th>
                    <th className="py-2 px-3">Narration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sales.map((sale) => (
                    <tr key={sale.sale_id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">#SALE-{sale.sale_id}</td>
                      <td className="py-2 px-3 text-slate-500">{sale.sale_date} ({sale.period || '2026-2027'})</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{sale.customer_name || 'Walk-in'}</td>
                      <td className="py-2 px-3 font-bold text-indigo-600">{sale.publication_name}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{sale.qty}</td>
                      <td className="py-2 px-3 text-right">₹{sale.rate.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-600">₹{sale.amt.toFixed(2)}</td>
                      <td className="py-2 px-3 text-slate-500">{sale.narration || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stock Purchases (Screenshot 8) */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {purchases.map((pur) => (
            <div key={pur.purchase_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Bill No: {pur.bill_no}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{pur.publisher_name}</h3>
                  <p className="text-[11px] text-slate-500">Bill Date: {pur.bill_date} • Rec Date: {pur.r_date}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block font-medium">Add/Less: ₹{pur.add_less}</span>
                  <span className="text-base font-black text-emerald-600">Net Amt: ₹{pur.net_amt.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {pur.items && pur.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-slate-50 font-semibold text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-1.5 px-3">Item Name</th>
                        <th className="py-1.5 px-3 text-center">Purchased Qty</th>
                        <th className="py-1.5 px-3 text-right">Wholesale Rate</th>
                        <th className="py-1.5 px-3 text-right">Amount</th>
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

      {/* Retail Sale Modal (Screenshot 9) */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Retail Sale to Permanent Customer</h3>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRetailSale} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={saleForm.sale_date}
                    onChange={(e) => setSaleForm({ ...saleForm, sale_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Period (Financial Year)</label>
                  <input
                    type="text"
                    value={saleForm.period}
                    onChange={(e) => setSaleForm({ ...saleForm, period: e.target.value })}
                    placeholder="2026-2027"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Customer Name / Walk-in</label>
                <input
                  type="text"
                  value={saleForm.customer_name}
                  onChange={(e) => setSaleForm({ ...saleForm, customer_name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publication</label>
                <select
                  value={saleForm.publication_id}
                  onChange={(e) => setSaleForm({ ...saleForm, publication_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                >
                  {mockPublications.map(p => (
                    <option key={p.publication_id} value={p.publication_id}>{p.public_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={saleForm.qty}
                    onChange={(e) => setSaleForm({ ...saleForm, qty: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={saleForm.rate}
                    onChange={(e) => setSaleForm({ ...saleForm, rate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Narration</label>
                <input
                  type="text"
                  value={saleForm.narration}
                  onChange={(e) => setSaleForm({ ...saleForm, narration: e.target.value })}
                  placeholder="Notes / Remarks"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSaleModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Process Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Purchase Modal (Screenshot 8) */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Purchase Stock Invoice (Screenshot 8)</h3>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePurchase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publisher</label>
                <select
                  value={purchaseForm.publisher_id}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, publisher_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                >
                  {mockPublishers.map(p => (
                    <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pub. Bill No.</label>
                  <input
                    type="text"
                    required
                    value={purchaseForm.bill_no}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, bill_no: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bill Date</label>
                  <input
                    type="date"
                    value={purchaseForm.bill_date}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, bill_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rec Date</label>
                  <input
                    type="date"
                    value={purchaseForm.r_date}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, r_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Item Adder Bar */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">Add Line Item:</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <select
                      value={purchaseForm.publication_id}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, publication_id: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                    >
                      {mockPublications.map(p => (
                        <option key={p.publication_id} value={p.publication_id}>{p.public_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={purchaseForm.qty}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, qty: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Rate"
                      value={purchaseForm.rate}
                      onChange={(e) => setPurchaseForm({ ...purchaseForm, rate: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddPurchaseItem}
                  className="w-full py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded hover:bg-indigo-100"
                >
                  + Apply Item to Bill Grid
                </button>
              </div>

              {/* Items Grid */}
              {purchaseForm.items.length > 0 && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2">Item Name</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {purchaseForm.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-semibold">{it.publication_name}</td>
                          <td className="p-2 text-center">{it.qty}</td>
                          <td className="p-2 text-right">₹{it.rate}</td>
                          <td className="p-2 text-right font-bold">₹{it.amt.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Add / Less Adjustment (₹)</label>
                  <input
                    type="number"
                    step="5"
                    value={purchaseForm.add_less}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, add_less: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>

                <div className="text-right flex flex-col justify-end">
                  <span className="text-[11px] text-slate-500 font-semibold">Calculated Net Amount</span>
                  <span className="text-base font-black text-emerald-600">
                    ₹{(purchaseForm.items.reduce((s, i) => s + i.amt, 0) + Number(purchaseForm.add_less)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Stock Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CounterSalesPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-semibold text-slate-500">Loading Counter Sales...</div>}>
      <CounterSalesContent />
    </Suspense>
  );
}
