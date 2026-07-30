'use client';

import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Bill } from '@/lib/types';

export default function BillPrintModal({ bill, onClose }: { bill: Bill | null; onClose: () => void }) {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header actions */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <h3 className="font-bold text-sm">Customer Monthly Bill Receipt (मासिक समाचार पत्र बिल)</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Paper */}
        <div className="p-8 print:p-0 space-y-6" id="printable-bill">
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-wider">ARYAN NEWS AGENCY</h1>
            <p className="text-sm font-semibold text-slate-700">आर्यन समाचार एजेंसी - समाचार पत्र एवं पत्रिका विक्रेता</p>
            <p className="text-xs text-slate-500 mt-1">Main Market Road, Near City Post Office • Phone: +91 98260 12345</p>
          </div>

          <div className="grid grid-cols-2 text-xs gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-slate-500">Bill No / क्रमांक:</p>
              <p className="font-bold text-slate-900 text-sm">#BILL-{bill.bill_id}</p>
              <p className="text-slate-500 mt-2">Customer Name / ग्राहक नाम:</p>
              <p className="font-bold text-slate-900">{bill.customer_name} ({bill.name_hindi || ''})</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Billing Period / बिल अवधि:</p>
              <p className="font-bold text-slate-900">{bill.bill_month} {bill.bill_year}</p>
              <p className="text-slate-500 mt-2">Region / क्षेत्र:</p>
              <p className="font-bold text-slate-900">{bill.region_name || 'Central Zone'}</p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                <tr>
                  <th className="p-3 border-r border-slate-300">Description / विवरण</th>
                  <th className="p-3 text-center border-r border-slate-300">Copies / प्रतियां</th>
                  <th className="p-3 text-right">Amount / राशि</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                <tr>
                  <td className="p-3 border-r border-slate-200">Newspaper & Magazine Charges ({bill.bill_month})</td>
                  <td className="p-3 text-center border-r border-slate-200">{bill.total_copies}</td>
                  <td className="p-3 text-right font-bold">₹{bill.paper_amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-3 border-r border-slate-200">Delivery Charges (वितरण शुल्क)</td>
                  <td className="p-3 text-center border-r border-slate-200">-</td>
                  <td className="p-3 text-right">₹{bill.delivery_amount.toFixed(2)}</td>
                </tr>
                {bill.discount_amount > 0 && (
                  <tr>
                    <td className="p-3 border-r border-slate-200 text-emerald-700">Discount Offered (छूट)</td>
                    <td className="p-3 text-center border-r border-slate-200">-</td>
                    <td className="p-3 text-right text-emerald-700">-₹{bill.discount_amount.toFixed(2)}</td>
                  </tr>
                )}
                {bill.previous_due > 0 && (
                  <tr className="bg-amber-50">
                    <td className="p-3 border-r border-slate-200 text-amber-900 font-semibold">Previous Arrears / पिछला बकाया</td>
                    <td className="p-3 text-center border-r border-slate-200">-</td>
                    <td className="p-3 text-right font-bold text-amber-900">₹{bill.previous_due.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold text-sm">
                <tr>
                  <td colSpan={2} className="p-3 text-right">NET PAYABLE AMOUNT (कुल देय राशि):</td>
                  <td className="p-3 text-right text-sky-400 text-base">₹{bill.net_payable.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p>Payment Terms: Due upon receipt.</p>
              <p className="italic">Thank you for your business!</p>
            </div>
            <div className="text-center font-semibold text-slate-700">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Authorized Stamp / Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
