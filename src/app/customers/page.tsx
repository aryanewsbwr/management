'use client';

import React, { useState } from 'react';
import { Users, Plus, Phone, MapPin, Newspaper, Search, ShieldCheck } from 'lucide-react';
import { mockCustomers, mockCustomerDetails, mockPublications, mockHawkers, mockRegions } from '@/lib/mockData';
import { Customer, CustomerDetail } from '@/lib/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [details, setDetails] = useState<CustomerDetail[]>(mockCustomerDetails);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<{
    name_eng: string;
    name_hindi: string;
    cust_type: 'Regular' | 'Agent' | 'Retail' | 'Govt';
    add1: string;
    hindi_add: string;
    phone: string;
    security_deposit: number;
    region_id: number;
    publication_id: number;
    hawker_id: number;
    qty: number;
  }>({
    name_eng: '',
    name_hindi: '',
    cust_type: 'Regular',
    add1: '',
    hindi_add: '',
    phone: '',
    security_deposit: 0,
    region_id: 1,
    publication_id: 1,
    hawker_id: 1,
    qty: 1
  });

  const filteredCustomers = customers.filter(c => 
    c.name_eng.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.name_hindi && c.name_hindi.includes(searchTerm)) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_eng.trim()) return;

    const regionName = mockRegions.find(r => r.region_id === Number(form.region_id))?.region_name || 'Central';
    const newCustId = customers.length + 1;

    const newCust: Customer = {
      customer_id: newCustId,
      name_eng: form.name_eng,
      name_hindi: form.name_hindi,
      cust_type: form.cust_type,
      add1: form.add1,
      hindi_add: form.hindi_add,
      phone: form.phone,
      security_deposit: Number(form.security_deposit),
      priority: 1,
      due_amount: 0.00,
      c_bal: 0.00,
      region_id: Number(form.region_id),
      region_name: regionName,
      paid_status: 'Paid',
      govt_supply: form.cust_type === 'Govt'
    };

    const pubName = mockPublications.find(p => p.publication_id === Number(form.publication_id))?.public_name;
    const hawkerName = mockHawkers.find(h => h.hawker_id === Number(form.hawker_id))?.name;

    const newSub: CustomerDetail = {
      sno: details.length + 1,
      customer_id: newCustId,
      publication_id: Number(form.publication_id),
      publication_name: pubName,
      hawker_id: Number(form.hawker_id),
      hawker_name: hawkerName,
      qty: Number(form.qty),
      circulation: 'Morning',
      s_date: new Date().toISOString().split('T')[0],
      discount: 0.00,
      delivery_charge: 30.00
    };

    setCustomers([...customers, newCust]);
    setDetails([...details, newSub]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customer Subscriptions (ग्राहक खाता)</h1>
          <p className="text-xs text-slate-500">English & Hindi accounts, paper delivery mappings, and hawker routing</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Subscription</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, Hindi name, or mobile..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((cust) => {
          const custSubs = details.filter(d => d.customer_id === cust.customer_id);
          return (
            <div key={cust.customer_id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{cust.name_eng}</h3>
                  {cust.name_hindi && <p className="text-xs font-bold text-slate-600">{cust.name_hindi}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {cust.cust_type}
                    </span>
                    <span className="text-xs text-slate-500">• {cust.region_name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Due Balance</span>
                  <span className={`text-base font-black ${cust.due_amount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    ₹{cust.due_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{cust.add1} {cust.hindi_add ? `(${cust.hindi_add})` : ''}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Phone: {cust.phone || 'N/A'}</span>
                </p>
              </div>

              {/* Subscribed Papers */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subscribed Papers:</h4>
                <div className="space-y-1">
                  {custSubs.map((sub) => (
                    <div key={sub.sno} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Newspaper className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-bold text-slate-900">{sub.publication_name || `Publication #${sub.publication_id}`}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 font-medium">
                        <span>Qty: <strong className="text-slate-900">{sub.qty}</strong></span>
                        <span className="text-slate-500">Hawker: {sub.hawker_name || 'Assigned'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base">New Customer & Paper Subscription</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Customer Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.name_eng}
                    onChange={(e) => setForm({ ...form, name_eng: e.target.value })}
                    placeholder="e.g. Sharma Ji (H.N. Sharma)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hindi Name (हिंदी)</label>
                  <input
                    type="text"
                    value={form.name_hindi}
                    onChange={(e) => setForm({ ...form, name_hindi: e.target.value })}
                    placeholder="एच. एन. शर्मा"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Customer Type</label>
                  <select
                    value={form.cust_type}
                    onChange={(e) => setForm({ ...form, cust_type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="Regular">Regular Resident</option>
                    <option value="Retail">Retail Store</option>
                    <option value="Agent">Agent / Bulk</option>
                    <option value="Govt">Govt Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9826012345"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Address (पता)</label>
                <input
                  type="text"
                  value={form.add1}
                  onChange={(e) => setForm({ ...form, add1: e.target.value })}
                  placeholder="House No 120, Sector 4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select Paper</label>
                  <select
                    value={form.publication_id}
                    onChange={(e) => setForm({ ...form, publication_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    {mockPublications.map(p => (
                      <option key={p.publication_id} value={p.publication_id}>{p.public_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hawker</label>
                  <select
                    value={form.hawker_id}
                    onChange={(e) => setForm({ ...form, hawker_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    {mockHawkers.map(h => (
                      <option key={h.hawker_id} value={h.hawker_id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Daily Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
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
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
