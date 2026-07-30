'use client';

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { mockPurchases } from '@/lib/mockData';
import { Purchase } from '@/lib/types';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Publisher Purchases (खरीद)</h1>
        <p className="text-xs text-slate-500">Record wholesale newspaper & magazine stock purchases from press vendors</p>
      </div>

      <div className="space-y-4">
        {purchases.map((pur) => (
          <div key={pur.purchase_id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {pur.bill_no}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{pur.publisher_name}</h3>
                <p className="text-xs text-slate-500">Bill Date: {pur.bill_date} • Received: {pur.r_date}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-semibold">Net Payable</span>
                <span className="text-xl font-black text-emerald-600">₹{pur.net_amt.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {pur.items && pur.items.length > 0 && (
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Publication</th>
                      <th className="p-3 text-center">Purchased Qty</th>
                      <th className="p-3 text-right">Wholesale Rate</th>
                      <th className="p-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {pur.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-slate-900">{item.publication_name}</td>
                        <td className="p-3 text-center font-bold text-indigo-600">{item.qty}</td>
                        <td className="p-3 text-right">₹{item.rate.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-slate-900">₹{item.amt.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
