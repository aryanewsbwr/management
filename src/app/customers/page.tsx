'use client';

import React, { useState } from 'react';
import { Users, Plus, Phone, MapPin, Newspaper, Search, Check, X, Calendar, Percent } from 'lucide-react';
import { mockCustomers, mockCustomerDetails, mockPublications, mockHawkers, mockRegions } from '@/lib/mockData';
import { Customer, CustomerDetail } from '@/lib/types';
import { transliterateToHindi } from '@/lib/transliteration';

const weekDaysList = [
  { id: 1, name: 'Mon', full: 'Monday' },
  { id: 2, name: 'Tue', full: 'Tuesday' },
  { id: 3, name: 'Wed', full: 'Wednesday' },
  { id: 4, name: 'Thu', full: 'Thursday' },
  { id: 5, name: 'Fri', full: 'Friday' },
  { id: 6, name: 'Sat', full: 'Saturday' },
  { id: 7, name: 'Sun', full: 'Sunday' },
];

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
    delivery_days: number[]; // Default [1,2,3,4,5,6,7]
    delivery_charge: number;
    discount_percent: number;
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
    qty: 1,
    delivery_days: [1, 2, 3, 4, 5, 6, 7], // All days selected by default
    delivery_charge: 30.00,
    discount_percent: 0
  });

  const filteredCustomers = customers.filter(c => 
    c.name_eng.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.name_hindi && c.name_hindi.includes(searchTerm)) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  // Instant Synchronous English to Hindi Transliteration for Name
  const handleEnglishNameChange = (val: string) => {
    const hindi = transliterateToHindi(val);
    setForm(prev => ({ ...prev, name_eng: val, name_hindi: hindi }));
  };

  // Instant Synchronous English to Hindi Transliteration for Address
  const handleEnglishAddressChange = (val: string) => {
    const hindi = transliterateToHindi(val);
    setForm(prev => ({ ...prev, add1: val, hindi_add: hindi }));
  };

  const toggleDeliveryDay = (dayId: number) => {
    setForm(prev => {
      const exists = prev.delivery_days.includes(dayId);
      if (exists) {
        if (prev.delivery_days.length === 1) return prev; // Keep at least 1 day
        return { ...prev, delivery_days: prev.delivery_days.filter(d => d !== dayId).sort() };
      } else {
        return { ...prev, delivery_days: [...prev.delivery_days, dayId].sort() };
      }
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_eng.trim()) return;

    const regionName = mockRegions.find(r => r.region_id === Number(form.region_id))?.region_name || 'Central';
    const newCustId = customers.length + 1;

    const newCust: Customer = {
      customer_id: newCustId,
      name_eng: form.name_eng,
      name_hindi: form.name_hindi || transliterateToHindi(form.name_eng),
      cust_type: form.cust_type,
      add1: form.add1,
      hindi_add: form.hindi_add || transliterateToHindi(form.add1),
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
      delivery_days: form.delivery_days,
      s_date: new Date().toISOString().split('T')[0],
      discount_percent: Number(form.discount_percent) || 0,
      discount: 0.00,
      delivery_charge: Number(form.delivery_charge) || 0.00
    };

    setCustomers([...customers, newCust]);
    setDetails([...details, newSub]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Accounts & Subscriptions</h1>
          <p className="text-xs text-slate-500">Auto English/Hindi transliteration, custom delivery days, discounts & charges</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
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
          placeholder="Search customer name, Hindi name, or mobile..."
          className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((cust) => {
          const custSubs = details.filter(d => d.customer_id === cust.customer_id);
          return (
            <div key={cust.customer_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{cust.name_eng}</h3>
                  {cust.name_hindi && <p className="text-xs font-bold text-slate-600">{cust.name_hindi}</p>}
                  <div className="flex items-center gap-2 mt-1">
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

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
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
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subscribed Papers:</h4>
                <div className="space-y-1.5">
                  {custSubs.map((sub) => {
                    const days = sub.delivery_days || [1,2,3,4,5,6,7];
                    return (
                      <div key={sub.sno} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <Newspaper className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{sub.publication_name || `Publication #${sub.publication_id}`}</span>
                          </div>
                          <span className="font-semibold text-slate-600">Qty: <strong className="text-slate-900">{sub.qty}</strong></span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                          <div>
                            <span className="font-medium">Days: </span>
                            <span className="font-bold text-indigo-700">
                              {days.length === 7 ? 'All 7 Days' : days.map(d => weekDaysList.find(w => w.id === d)?.name).join(', ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span>Delivery: <strong className="text-slate-800">₹{sub.delivery_charge}</strong>/mo</span>
                            {sub.discount_percent > 0 && (
                              <span className="text-emerald-600 font-bold">Disc: {sub.discount_percent}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">New Customer Subscription</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Customer Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.name_eng}
                    onChange={(e) => handleEnglishNameChange(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hindi Name (हिंदी नाम - Auto Transliterated)</label>
                  <input
                    type="text"
                    value={form.name_hindi}
                    onChange={(e) => setForm({ ...form, name_hindi: e.target.value })}
                    placeholder="रामेश कुमार"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Customer Type</label>
                  <select
                    value={form.cust_type}
                    onChange={(e) => setForm({ ...form, cust_type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Address (English)</label>
                  <input
                    type="text"
                    value={form.add1}
                    onChange={(e) => handleEnglishAddressChange(e.target.value)}
                    placeholder="House 120, Sector 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hindi Address (हिंदी पता - Auto Transliterated)</label>
                  <input
                    type="text"
                    value={form.hindi_add}
                    onChange={(e) => setForm({ ...form, hindi_add: e.target.value })}
                    placeholder="हाउस 120, सेक्टर 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Publication Selection & Delivery Config */}
              <div className="border-t border-slate-200 pt-3 space-y-3">
                <h4 className="font-bold text-slate-900">Publication & Delivery Configuration</h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Select Paper</label>
                    <select
                      value={form.publication_id}
                      onChange={(e) => setForm({ ...form, publication_id: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>

                {/* Delivery Days of Week Picker */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Delivery Days of the Week (Default: All Days)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {weekDaysList.map((day) => {
                      const isSelected = form.delivery_days.includes(day.id);
                      return (
                        <button
                          type="button"
                          key={day.id}
                          onClick={() => toggleDeliveryDay(day.id)}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {day.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Publication Delivery Charge & Discount Percent */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Publication Delivery Charge (₹/mo)</label>
                    <input
                      type="number"
                      step="5"
                      value={form.delivery_charge}
                      onChange={(e) => setForm({ ...form, delivery_charge: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })}
                      placeholder="e.g. 5, 10, 15%"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>
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
                  Create Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
