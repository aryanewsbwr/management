'use client';

import React, { useState } from 'react';
import { Users, Plus, Phone, MapPin, Newspaper, Search, Check, X, Calendar, Percent, PauseCircle } from 'lucide-react';
import { mockCustomers, mockCustomerDetails, mockPublications, mockHawkers, mockRegions } from '@/lib/mockData';
import { Customer, CustomerDetail, CustomerDiscontinue } from '@/lib/types';
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

import { useSearchParams } from 'next/navigation';

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const initialTab = tabQuery === 'discontinue' ? 'discontinue' : 'customers';

  const [activeTab, setActiveTab] = useState<'customers' | 'discontinue'>(initialTab);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [details, setDetails] = useState<CustomerDetail[]>(mockCustomerDetails);
  
  // Vacation Stops / Discontinue Info Log (Screenshot 10)
  const [discontinues, setDiscontinues] = useState<CustomerDiscontinue[]>([
    { discontinue_id: 1, customer_id: 1, customer_name: 'Sharma Ji (H.N. Sharma)', publication_id: 1, publication_name: 'Dainik Bhaskar', hawker_name: 'Ramesh Kumar', type: 'Temporary', from_date: '2026-08-01', to_date: '2026-08-10', entry_date: '2026-07-30', period: '2026-2027' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscontinueModalOpen, setIsDiscontinueModalOpen] = useState(false);

  // Customer Info Form State (Matching Screenshot 5)
  const [form, setForm] = useState({
    name_eng: '',
    name_hindi: '',
    add1: '',
    add2: '',
    hindi_add: '',
    phone: '',
    priority: 1,
    region_id: 1,
    security_deposit: 0,
    due_amount: 0,
    cust_type: 'Regular' as const,
    is_sub_agent: false,
    susha_05: true,
    is_self: true,
    govt_supply: false,
    sub_agent_id: 0,
    
    // Subscription Grid Fields
    publication_id: 1,
    hawker_id: 1,
    hw_sa: 'Hawker' as const,
    qty: 1,
    circulation: 'Morning' as const,
    delivery_days: [1, 2, 3, 4, 5, 6, 7],
    discount_percent: 0,
    delivery_charge: 30.00
  });

  // Vacation Stop Form State (Matching Screenshot 10)
  const [disForm, setDisForm] = useState({
    customer_id: 1,
    publication_id: 1,
    hawker_id: 1,
    type: 'Temporary' as 'Temporary' | 'Permanent',
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0],
    period: '2026-2027'
  });

  const filteredCustomers = customers.filter(c => 
    c.name_eng.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.name_hindi && c.name_hindi.includes(searchTerm)) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  // Instant Synchronous English to Hindi Transliteration
  const handleEnglishNameChange = (val: string) => {
    const hindi = transliterateToHindi(val);
    setForm(prev => ({ ...prev, name_eng: val, name_hindi: hindi }));
  };

  const handleEnglishAddressChange = (val: string) => {
    const hindi = transliterateToHindi(val);
    setForm(prev => ({ ...prev, add1: val, hindi_add: hindi }));
  };

  const toggleDeliveryDay = (dayId: number) => {
    setForm(prev => {
      const exists = prev.delivery_days.includes(dayId);
      if (exists) {
        if (prev.delivery_days.length === 1) return prev;
        return { ...prev, delivery_days: prev.delivery_days.filter(d => d !== dayId).sort() };
      } else {
        return { ...prev, delivery_days: [...prev.delivery_days, dayId].sort() };
      }
    });
  };

  const handleAddCustomer = (e: React.FormEvent) => {
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
      add2: form.add2,
      hindi_add: form.hindi_add || transliterateToHindi(form.add1),
      phone: form.phone,
      security_deposit: Number(form.security_deposit),
      priority: Number(form.priority) || 1,
      due_amount: Number(form.due_amount) || 0.00,
      c_bal: 0.00,
      region_id: Number(form.region_id),
      region_name: regionName,
      paid_status: 'Paid',
      govt_supply: form.govt_supply,
      is_sub_agent: form.is_sub_agent,
      susha_05: form.susha_05,
      is_self: form.is_self
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
      circulation: form.circulation,
      delivery_days: form.delivery_days,
      s_date: new Date().toISOString().split('T')[0],
      discount_percent: Number(form.discount_percent) || 0,
      discount: 0.00,
      delivery_charge: Number(form.delivery_charge) || 0.00,
      hw_sa: form.hw_sa
    };

    setCustomers([...customers, newCust]);
    setDetails([...details, newSub]);
    setIsModalOpen(false);
  };

  const handleAddDiscontinue = (e: React.FormEvent) => {
    e.preventDefault();
    const custName = customers.find(c => c.customer_id === Number(disForm.customer_id))?.name_eng;
    const pubName = mockPublications.find(p => p.publication_id === Number(disForm.publication_id))?.public_name;
    const hawkerName = mockHawkers.find(h => h.hawker_id === Number(disForm.hawker_id))?.name;

    const newDis: CustomerDiscontinue = {
      discontinue_id: discontinues.length + 1,
      customer_id: Number(disForm.customer_id),
      customer_name: custName,
      publication_id: Number(disForm.publication_id),
      publication_name: pubName,
      hawker_id: Number(disForm.hawker_id),
      hawker_name: hawkerName,
      type: disForm.type,
      from_date: disForm.from_date,
      to_date: disForm.type === 'Temporary' ? disForm.to_date : undefined,
      entry_date: new Date().toISOString().split('T')[0],
      period: disForm.period
    };

    setDiscontinues([...discontinues, newDis]);
    setIsDiscontinueModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Accounts & Subscriptions</h1>
          <p className="text-xs text-slate-500">Customer master directory, paper subscriptions & vacation discontinuation holds</p>
        </div>
        {activeTab === 'customers' ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Customer Info</span>
          </button>
        ) : (
          <button
            onClick={() => setIsDiscontinueModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 self-start md:self-auto cursor-pointer"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>Add Discontinue / Vacation Stop</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'customers'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customer Directory & Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveTab('discontinue')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'discontinue'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <PauseCircle className="w-3.5 h-3.5" />
          <span>Vacation Discontinues Log</span>
        </button>
      </div>

      {/* Tab 1: Customer Directory (Screenshot 5) */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((cust) => {
              const custSubs = details.filter(d => d.customer_id === cust.customer_id);
              return (
                <div key={cust.customer_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          Route Priority #{cust.priority}
                        </span>
                        {cust.govt_supply && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            Govt Supply
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{cust.name_eng}</h3>
                      {cust.name_hindi && <p className="text-xs font-bold text-slate-600">{cust.name_hindi}</p>}
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
                      <span>{cust.add1} {cust.hindi_add ? `(${cust.hindi_add})` : ''} • Zone: {cust.region_name}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Phone: {cust.phone || 'N/A'} • Security Deposit: ₹{cust.security_deposit}</span>
                    </p>
                  </div>

                  {/* Subscribed Papers Grid */}
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
                                {sub.discount_percent > 0 && <span className="text-emerald-600 font-bold">Disc: {sub.discount_percent}%</span>}
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
        </div>
      )}

      {/* Tab 2: Vacation Discontinues Log (Screenshot 10) */}
      {activeTab === 'discontinue' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Discontinue Info Log (छुट्टी / वैकेशन स्टॉप)</h3>
            <button
              onClick={() => setIsDiscontinueModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-xs"
            >
              + Add Vacation Stop
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3">Publication</th>
                  <th className="py-2 px-3">Hawker</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">From Date</th>
                  <th className="py-2 px-3">To Date</th>
                  <th className="py-2 px-3">Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {discontinues.map((d) => (
                  <tr key={d.discontinue_id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{d.customer_name}</td>
                    <td className="py-2.5 px-3 text-indigo-600 font-semibold">{d.publication_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{d.hawker_name || 'Assigned Hawker'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        d.type === 'Temporary' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{d.from_date}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{d.to_date || 'Permanent'}</td>
                    <td className="py-2.5 px-3 text-slate-500">{d.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Add Modal (Screenshot 5) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-xl rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Customer Info (Matching Legacy Form)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              {/* Checkbox Type Bar (Screenshot 5) */}
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!form.is_sub_agent}
                    onChange={(e) => setForm({ ...form, is_sub_agent: !e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Customer</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_sub_agent}
                    onChange={(e) => setForm({ ...form, is_sub_agent: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Sub Agent</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.susha_05}
                    onChange={(e) => setForm({ ...form, susha_05: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Susha 05 (Hindi Font)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.govt_supply}
                    onChange={(e) => setForm({ ...form, govt_supply: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Govt Supply</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Name (Eng) *</label>
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
                  <label className="block text-slate-600 font-semibold mb-1">Name (Hindi - Auto Filled)</label>
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
                  <label className="block text-slate-600 font-semibold mb-1">Address (Line 1)</label>
                  <input
                    type="text"
                    value={form.add1}
                    onChange={(e) => handleEnglishAddressChange(e.target.value)}
                    placeholder="House 120, Sector 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Add. (Hindi - Auto Filled)</label>
                  <input
                    type="text"
                    value={form.hindi_add}
                    onChange={(e) => setForm({ ...form, hindi_add: e.target.value })}
                    placeholder="हाउस 120, सेक्टर 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Region Zone</label>
                  <select
                    value={form.region_id}
                    onChange={(e) => setForm({ ...form, region_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    {mockRegions.map(r => (
                      <option key={r.region_id} value={r.region_id}>{r.region_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9826012345"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Route Priority Order</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={form.security_deposit}
                    onChange={(e) => setForm({ ...form, security_deposit: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Past Due Amt (₹)</label>
                  <input
                    type="number"
                    value={form.due_amount}
                    onChange={(e) => setForm({ ...form, due_amount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Subscriptions Grid Config (Screenshot 5 Data Grid) */}
              <div className="border-t border-slate-200 pt-3 space-y-3">
                <h4 className="font-bold text-slate-900">Subscription Item Configuration</h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Item / Publication</label>
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
                    <label className="block text-slate-600 font-semibold mb-1">Hawker (HW/SA)</label>
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
                    <label className="block text-slate-600 font-semibold mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={form.qty}
                      onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>

                {/* Delivery Days Picker */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Delivery Days (Def.Days)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {weekDaysList.map((day) => {
                      const isSelected = form.delivery_days.includes(day.id);
                      return (
                        <button
                          type="button"
                          key={day.id}
                          onClick={() => toggleDeliveryDay(day.id)}
                          className={`px-2.5 py-1 rounded font-bold text-xs transition-all ${
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Delivery Charge (Del. ₹/mo)</label>
                    <input
                      type="number"
                      value={form.delivery_charge}
                      onChange={(e) => setForm({ ...form, delivery_charge: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Discount (Dis. %)</label>
                    <input
                      type="number"
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })}
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
                  Save Customer Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discontinue / Vacation Stop Modal (Screenshot 10) */}
      {isDiscontinueModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Discontinue Info (Vacation / Stop Paper)</h3>
              <button onClick={() => setIsDiscontinueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDiscontinue} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Customer Name</label>
                <select
                  value={disForm.customer_id}
                  onChange={(e) => setDisForm({ ...disForm, customer_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                >
                  {customers.map(c => (
                    <option key={c.customer_id} value={c.customer_id}>{c.name_eng}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Publication</label>
                  <select
                    value={disForm.publication_id}
                    onChange={(e) => setDisForm({ ...disForm, publication_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    {mockPublications.map(p => (
                      <option key={p.publication_id} value={p.publication_id}>{p.public_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hawker</label>
                  <select
                    value={disForm.hawker_id}
                    onChange={(e) => setDisForm({ ...disForm, hawker_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    {mockHawkers.map(h => (
                      <option key={h.hawker_id} value={h.hawker_id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Temporary vs Permanent Checkbox Group (Screenshot 10) */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">Stop Type:</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="dis_type"
                      checked={disForm.type === 'Temporary'}
                      onChange={() => setDisForm({ ...disForm, type: 'Temporary' })}
                      className="text-amber-600"
                    />
                    <span>Temporary (F1)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="dis_type"
                      checked={disForm.type === 'Permanent'}
                      onChange={() => setDisForm({ ...disForm, type: 'Permanent' })}
                      className="text-rose-600"
                    />
                    <span>Permanent (F2)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-slate-500 font-medium mb-0.5">From Date</label>
                    <input
                      type="date"
                      value={disForm.from_date}
                      onChange={(e) => setDisForm({ ...disForm, from_date: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-slate-900 font-medium"
                    />
                  </div>
                  {disForm.type === 'Temporary' && (
                    <div>
                      <label className="block text-slate-500 font-medium mb-0.5">To Date</label>
                      <input
                        type="date"
                        value={disForm.to_date}
                        onChange={(e) => setDisForm({ ...disForm, to_date: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded p-1 text-slate-900 font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDiscontinueModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-xs"
                >
                  Save Discontinue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
