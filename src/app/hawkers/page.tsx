'use client';

import React, { useState } from 'react';
import { Truck, Plus, Phone, MapPin, Navigation, BookOpen } from 'lucide-react';
import { mockHawkers, mockRegions, mockCollectors, mockReceiptIssues } from '@/lib/mockData';
import { Hawker, Collector, ReceiptIssue } from '@/lib/types';

export default function HawkersPage() {
  const [activeTab, setActiveTab] = useState<'hawkers' | 'collectors'>('hawkers');
  const [hawkers, setHawkers] = useState<Hawker[]>(mockHawkers);
  const [collectors] = useState<Collector[]>(mockCollectors);
  const [issues] = useState<ReceiptIssue[]>(mockReceiptIssues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', address: '', region_id: 1 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const regionName = mockRegions.find(r => r.region_id === Number(form.region_id))?.region_name || 'Central';

    const newHawker: Hawker = {
      hawker_id: hawkers.length + 1,
      name: form.name,
      mobile: form.mobile,
      address: form.address,
      region_id: Number(form.region_id),
      region_name: regionName
    };

    setHawkers([...hawkers, newHawker]);
    setForm({ name: '', mobile: '', address: '', region_id: 1 });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hawkers & Route Distribution</h1>
          <p className="text-xs text-slate-500">Delivery hawker routes, collectors, and receipt book allotments</p>
        </div>
        {activeTab === 'hawkers' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hawker</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('hawkers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'hawkers'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Hawker Delivery Boys</span>
        </button>

        <button
          onClick={() => setActiveTab('collectors')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'collectors'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Collectors & Receipt Books</span>
        </button>
      </div>

      {/* Tab 1: Hawkers */}
      {activeTab === 'hawkers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hawkers.map((hawker) => (
            <div key={hawker.hawker_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{hawker.name}</h3>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    ID #{hawker.hawker_id}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-bold text-indigo-600">{hawker.region_name || 'Central Zone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Mobile: {hawker.mobile || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Address: {hawker.address || 'Local Route'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Collectors & Receipt Books */}
      {activeTab === 'collectors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectors.map((col) => (
              <div key={col.collect_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">{col.name}</h3>
                <p className="text-slate-500">Phone: {col.phone || 'N/A'}</p>
                <p className="text-slate-500">Office/Area: {col.address || 'Central Office'}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Issued Receipt Books Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Issue ID</th>
                    <th className="py-2 px-3">Collector Name</th>
                    <th className="py-2 px-3">Receipt Range</th>
                    <th className="py-2 px-3">Issue Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {issues.map((iss) => (
                    <tr key={iss.issue_id}>
                      <td className="py-2 px-3 font-semibold text-slate-900">#ISSUE-{iss.issue_id}</td>
                      <td className="py-2 px-3 font-bold text-indigo-600">{iss.collector_name}</td>
                      <td className="py-2 px-3 font-mono text-slate-800">Rec {iss.receipt_from} to Rec {iss.receipt_to}</td>
                      <td className="py-2 px-3 text-slate-500">{iss.issue_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <h3 className="font-bold text-sm">Add New Delivery Hawker</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Hawker Name (हिंदी / English) *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar (रामेश कुमार)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="9827012345"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Region</label>
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
                <label className="block text-slate-600 font-semibold mb-1">Address / Colony</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Quarter 42, Civil Lines"
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
                  Save Hawker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
