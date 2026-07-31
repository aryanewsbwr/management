'use client';

import React, { useState } from 'react';
import { FileText, Printer, Play, Plus, CreditCard, Filter, CheckCircle, X } from 'lucide-react';
import { mockBills, mockCustomers, mockCustomerDetails, mockPublicationRates, mockHolidays, mockReceipts, mockCollectors, mockRegions } from '@/lib/mockData';
import { calculateMonthlyBill } from '@/lib/billingEngine';
import { Bill, Receipt } from '@/lib/types';
import BillPrintModal from '@/components/BillPrintModal';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'bills' | 'receipts'>('bills');
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  
  // Bill Processing Filters (Screenshot 14)
  const [selectedRegion, setSelectedRegion] = useState<number | 'ALL'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isGenerating, setIsGenerating] = useState(false);

  const [activePrintBill, setActivePrintBill] = useState<Bill | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Payment Receipt Control Section Form State (Matching Screenshot 13)
  const [receiptForm, setReceiptForm] = useState({
    customer_id: 1,
    collect_id: 1,
    bill_id: 101,
    bill_no: 'BILL-101',
    bill_month: 'July',
    bill_year: 2026,
    bill_amount: 460.00,
    manual_rcp_amt: 0.00,
    receipt_amount: 460.00,
    less_amount: 0.00,
    balance_amount: 0.00,
    manual_rcp_no: '1187540',
    manual_rcp_date: new Date().toISOString().split('T')[0],
    receipt_date: new Date().toISOString().split('T')[0],
    payment_mode: 'Cash' as 'Cash' | 'Cheque' | 'UPI' | 'Bank Transfer',
    cheque_no: '',
    cheque_date: '',
    remarks: 'Monthly Payment Received'
  });

  // Bill Processing Handler (Screenshot 14)
  const handleGenerateAllBills = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const filteredCusts = selectedRegion === 'ALL' 
        ? mockCustomers 
        : mockCustomers.filter(c => c.region_id === Number(selectedRegion));

      const newGeneratedBills: Bill[] = filteredCusts.map((cust) => {
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

  const handleSelectCustomerForReceipt = (custId: number) => {
    const cust = mockCustomers.find(c => c.customer_id === custId);
    const bill = bills.find(b => b.customer_id === custId);

    setReceiptForm(prev => ({
      ...prev,
      customer_id: custId,
      bill_amount: bill ? bill.net_payable : (cust?.due_amount || 0),
      receipt_amount: bill ? bill.net_payable : (cust?.due_amount || 0),
      balance_amount: 0
    }));
  };

  // Save Payment Receipt (Screenshot 13)
  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const custName = mockCustomers.find(c => c.customer_id === Number(receiptForm.customer_id))?.name_eng;
    const collectorName = mockCollectors.find(col => col.collect_id === Number(receiptForm.collect_id))?.name;

    const newReceipt: Receipt = {
      receipt_id: receipts.length + 101,
      receipt_no: `REC-${receiptForm.manual_rcp_no || (receipts.length + 1000)}`,
      customer_id: Number(receiptForm.customer_id),
      customer_name: custName,
      collect_id: Number(receiptForm.collect_id),
      collector_name: collectorName,
      receipt_date: receiptForm.receipt_date,
      bill_amount: Number(receiptForm.bill_amount),
      manual_rcp_amt: Number(receiptForm.manual_rcp_amt),
      receipt_amount: Number(receiptForm.receipt_amount),
      less_amount: Number(receiptForm.less_amount),
      balance_amount: Number(receiptForm.balance_amount),
      manual_rcp_no: receiptForm.manual_rcp_no,
      manual_rcp_date: receiptForm.manual_rcp_date,
      payment_mode: receiptForm.payment_mode,
      cheque_no: receiptForm.cheque_no,
      cheque_date: receiptForm.cheque_date,
      remarks: receiptForm.remarks
    };

    setReceipts([newReceipt, ...receipts]);
    setIsReceiptModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Billing & Payment Receipts</h1>
          <p className="text-xs text-slate-500">Regional bill processing engine, arrears ledger & manual payment receipt control</p>
        </div>

        {activeTab === 'bills' ? (
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Bill Processing Region Selector (Screenshot 14) */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-500">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Regions</option>
                {mockRegions.map(r => (
                  <option key={r.region_id} value={r.region_id}>{r.region_name}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button
              onClick={handleGenerateAllBills}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isGenerating ? 'Processing...' : 'Process Bills (Screenshot 14)'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Payment Receipt</span>
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
          <span>Bill Processing & Ledger</span>
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
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bills for {selectedMonth} {selectedYear} ({selectedRegion === 'ALL' ? 'All Regions' : 'Selected Region'})</h3>
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

      {/* Tab 2: Payment Receipts Log (Screenshot 13 & 13 payment recipt.csv) */}
      {activeTab === 'receipts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment Receipts Log (Payment Receipt Control Section)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Recp No</th>
                  <th className="py-2 px-3">Manual Recp No</th>
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
                    <td className="py-2.5 px-3 font-mono text-slate-800 font-bold">{rec.manual_rcp_no || 'N/A'}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{rec.customer_name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.collector_name || 'Counter'}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.receipt_date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{rec.payment_mode} {rec.cheque_no ? `(${rec.cheque_no})` : ''}</td>
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

      {/* Payment Receipt Control Section Modal (Exact Match to Screenshot 13) */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-xl rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-slate-900">Payment Receipt Entry (Screenshot 13 Control Section)</h3>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReceipt} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Customer</label>
                  <select
                    value={receiptForm.customer_id}
                    onChange={(e) => handleSelectCustomerForReceipt(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    {mockCollectors.map(col => (
                      <option key={col.collect_id} value={col.collect_id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Control Section Fields (Screenshot 13) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">Control Section Details</h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Recp. No</label>
                    <input
                      type="text"
                      value={receiptForm.manual_rcp_no}
                      onChange={(e) => setReceiptForm({ ...receiptForm, manual_rcp_no: e.target.value })}
                      placeholder="1187540"
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Recp Date</label>
                    <input
                      type="date"
                      value={receiptForm.receipt_date}
                      onChange={(e) => setReceiptForm({ ...receiptForm, receipt_date: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Bill No & Year</label>
                    <input
                      type="text"
                      value={receiptForm.bill_no}
                      onChange={(e) => setReceiptForm({ ...receiptForm, bill_no: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Bill Amt (₹)</label>
                    <input
                      type="number"
                      value={receiptForm.bill_amount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, bill_amount: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Ml. Rcp. Amt</label>
                    <input
                      type="number"
                      value={receiptForm.manual_rcp_amt}
                      onChange={(e) => setReceiptForm({ ...receiptForm, manual_rcp_amt: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Ls. Amt (Less)</label>
                    <input
                      type="number"
                      value={receiptForm.less_amount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, less_amount: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Rev. Amt (Recv)</label>
                    <input
                      type="number"
                      value={receiptForm.receipt_amount}
                      onChange={(e) => setReceiptForm({ ...receiptForm, receipt_amount: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-emerald-700 font-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Mal. Recp. No (Manual Book)</label>
                    <input
                      type="text"
                      value={receiptForm.manual_rcp_no}
                      onChange={(e) => setReceiptForm({ ...receiptForm, manual_rcp_no: e.target.value })}
                      placeholder="e.g. 1187540"
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Mal. Recp. Dt</label>
                    <input
                      type="date"
                      value={receiptForm.manual_rcp_date}
                      onChange={(e) => setReceiptForm({ ...receiptForm, manual_rcp_date: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* Payment Mode Selection: Cash vs Cheque (Screenshot 13) */}
                <div className="space-y-2 pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="pmode"
                        checked={receiptForm.payment_mode === 'Cash'}
                        onChange={() => setReceiptForm({ ...receiptForm, payment_mode: 'Cash' })}
                        className="text-indigo-600"
                      />
                      <span>Cash (F1)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="pmode"
                        checked={receiptForm.payment_mode === 'Cheque'}
                        onChange={() => setReceiptForm({ ...receiptForm, payment_mode: 'Cheque' })}
                        className="text-indigo-600"
                      />
                      <span>Cheque (F2)</span>
                    </label>
                  </div>

                  {receiptForm.payment_mode === 'Cheque' && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Cheque No</label>
                        <input
                          type="text"
                          value={receiptForm.cheque_no}
                          onChange={(e) => setReceiptForm({ ...receiptForm, cheque_no: e.target.value })}
                          placeholder="CHQ-001928"
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Cheque Date</label>
                        <input
                          type="date"
                          value={receiptForm.cheque_date}
                          onChange={(e) => setReceiptForm({ ...receiptForm, cheque_date: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Narration / Remarks</label>
                <input
                  type="text"
                  value={receiptForm.remarks}
                  onChange={(e) => setReceiptForm({ ...receiptForm, remarks: e.target.value })}
                  placeholder="Payment received against invoice"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
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
                  Apply & Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
