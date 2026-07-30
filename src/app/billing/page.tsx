'use client';

import React, { useState } from 'react';
import { FileText, Printer, Play, Plus, CreditCard } from 'lucide-react';
import { mockBills, mockCustomers, mockCustomerDetails, mockPublicationRates, mockHolidays, mockReceipts, mockCollectors } from '@/lib/mockData';
import { calculateMonthlyBill } from '@/lib/billingEngine';
import { Bill, Receipt } from '@/lib/types';
import BillPrintModal from '@/components/BillPrintModal';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'bills' | 'receipts'>('bills');
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activePrintBill, setActivePrintBill] = useState<Bill | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const [receiptForm, setReceiptForm] = useState({
    customer_id: 1,
    collect_id: 1,
    receipt_amount: 500,
    less_amount: 0,
    payment_mode: 'Cash' as const,
    remarks: 'Monthly Payment'
  });

  const handleGenerateAllBills = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const newGeneratedBills: Bill[] = mockCustomers.map((cust) => {
        return calculateMonthlyBill(
          cust,
          mockCustomerDetails,
          mockPublicationRates,
          mockHolidays,
          selectedMonth,
          selectedYear
        );
      });

      setBills(newGeneratedBills);
      setIsGenerating(false);
    }, 600);
  };

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const custName = mockCustomers.find(c => c.customer_id === Number(receiptForm.customer_id))?.name_eng;
    const collectorName = mockCollectors.find(col => col.collect_id === Number(receiptForm.collect_id))?.name;

    const newReceipt: Receipt = {
      receipt_id: receipts.length + 101,
      receipt_no: `REC-2026-00${receipts.length + 1}`,
      customer_id: Number(receiptForm.customer_id),
      customer_name: custName,
      collect_id: Number(receiptForm.collect_id),
      collector_name: collectorName,
      receipt_date: new Date().toISOString().split('T')[0],
      bill_amount: Number(receiptForm.receipt_amount) + Number(receiptForm.less_amount),
      receipt_amount: Number(receiptForm.receipt_amount),
      less_amount: Number(receiptForm.less_amount),
      balance_amount: 0.00,
      payment_mode: receiptForm.payment_mode,
      remarks: receiptForm.remarks
    };

    setReceipts([newReceipt, ...receipts]);
    setIsReceiptModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Billing & Payment Receipts</h1>
          <p className="text-xs text-slate-500">Calculate customer bills, track arrears & record collection receipts</p>
        </div>
        
        {activeTab === 'bills' ? (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>

            <button
              onClick={handleGenerateAllBills}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isGenerating ? 'Calculating...' : 'Run Bills'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Receipt</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('bills')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'bills'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Monthly Bills Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'receipts'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Receipts Log</span>
        </button>
      </div>

      {/* Tab 1: Monthly Bills */}
      {activeTab === 'bills' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bills for {selectedMonth} {selectedYear}</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {bills.length} bills</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Bill ID</th>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3 text-center">Copies</th>
                  <th className="py-2 px-3 text-right">Paper Amt</th>
                  <th className="py-2 px-3 text-right">Delivery</th>
                  <th className="py-2 px-3 text-right">Arrears</th>
                  <th className="py-2 px-3 text-right">Net Payable</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bills.map((bill) => (
                  <tr key={bill.bill_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-indigo-600">#BILL-{bill.bill_id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {bill.customer_name}
                      {bill.name_hindi && <span className="block text-[11px] text-slate-400 font-normal">{bill.name_hindi}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-900 font-bold">{bill.total_copies}</td>
                    <td className="py-2.5 px-3 text-right">₹{bill.paper_amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">₹{bill.delivery_amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-amber-600 font-bold">₹{bill.previous_due.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">₹{bill.net_payable.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        bill.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setActivePrintBill(bill)}
                        className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Payment Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment Receipts Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Receipt No</th>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3">Collector</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Mode</th>
                  <th className="py-2 px-3 text-right">Received Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {receipts.map((rec) => (
                  <tr key={rec.receipt_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-indigo-600">{rec.receipt_no}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{rec.customer_name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.collector_name || 'Counter'}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.receipt_date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{rec.payment_mode}</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-600">₹{rec.receipt_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Print Bill Receipt Modal */}
      <BillPrintModal bill={activePrintBill} onClose={() => setActivePrintBill(null)} />

      {/* Issue Receipt Modal */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <h3 className="font-bold text-sm">Issue Payment Receipt</h3>
            <form onSubmit={handleAddReceipt} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Customer</label>
                <select
                  value={receiptForm.customer_id}
                  onChange={(e) => setReceiptForm({ ...receiptForm, customer_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                >
                  {mockCustomers.map(c => (
                    <option key={c.customer_id} value={c.customer_id}>{c.name_eng} (Due: ₹{c.due_amount})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bill Collector</label>
                <select
                  value={receiptForm.collect_id}
                  onChange={(e) => setReceiptForm({ ...receiptForm, collect_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
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
                    value={receiptForm.receipt_amount}
                    onChange={(e) => setReceiptForm({ ...receiptForm, receipt_amount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={receiptForm.payment_mode}
                    onChange={(e) => setReceiptForm({ ...receiptForm, payment_mode: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / PhonePe / GPay</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
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
