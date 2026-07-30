'use client';

import React, { useState } from 'react';
import { Newspaper, Calendar, Building2, Plus, Sun, Layers } from 'lucide-react';
import { mockPublications, mockPublicationRates, mockPublishers, mockHolidays, mockPublicationSups } from '@/lib/mockData';
import { Publication, PublicationRate, Publisher, Holiday, PublicationSup } from '@/lib/types';

const weekDays = [
  { id: 1, name: 'Monday (सोमवार)' },
  { id: 2, name: 'Tuesday (मंगलवार)' },
  { id: 3, name: 'Wednesday (बुधवार)' },
  { id: 4, name: 'Thursday (गुरुवार)' },
  { id: 5, name: 'Friday (शुक्रवार)' },
  { id: 6, name: 'Saturday (शनिवार)' },
  { id: 7, name: 'Sunday (रविवार)' },
];

export default function PublicationsPage() {
  const [activeTab, setActiveTab] = useState<'rates' | 'publishers' | 'holidays' | 'supplements'>('rates');
  const [publications] = useState<Publication[]>(mockPublications);
  const [rates, setRates] = useState<PublicationRate[]>(mockPublicationRates);
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [supplements] = useState<PublicationSup[]>(mockPublicationSups);

  const [selectedPub, setSelectedPub] = useState<Publication>(mockPublications[0]);

  const pubRates = rates.filter(r => r.publication_id === selectedPub.publication_id);

  const handleRateChange = (dayId: number, newRate: number) => {
    const existingIdx = rates.findIndex(r => r.publication_id === selectedPub.publication_id && r.day_of_week === dayId);
    if (existingIdx >= 0) {
      const updated = [...rates];
      updated[existingIdx].rate = newRate;
      setRates(updated);
    } else {
      setRates([...rates, { publication_id: selectedPub.publication_id, day_of_week: dayId, rate: newRate }]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Publications & Rates</h1>
        <p className="text-xs text-slate-500">Manage newspapers, rates, publishers, holidays & supplements</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('rates')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'rates'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Weekday Rates</span>
        </button>

        <button
          onClick={() => setActiveTab('publishers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'publishers'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Publishers Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'holidays'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Holidays Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('supplements')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'supplements'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Supplements</span>
        </button>
      </div>

      {/* Tab 1: Weekday Rates */}
      {activeTab === 'rates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Paper</p>
            <div className="space-y-1">
              {publications.map((pub) => {
                const isSelected = pub.publication_id === selectedPub.publication_id;
                return (
                  <button
                    key={pub.publication_id}
                    onClick={() => setSelectedPub(pub)}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{pub.public_name}</p>
                      <p className="text-[11px] text-slate-400 font-normal">{pub.pub_hindi} • {pub.type_p}</p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                      {pub.abrv}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedPub.public_name} ({selectedPub.pub_hindi})</h2>
                <p className="text-xs text-slate-500">Circulation: {selectedPub.circulation} • Frequency: {selectedPub.type_p}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weekDays.map((day) => {
                const currentRate = pubRates.find(r => r.day_of_week === day.id)?.rate || 5.00;
                return (
                  <div key={day.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{day.name}</p>
                      <p className="text-[11px] text-slate-400">Standard rate</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <span className="font-bold text-indigo-600">₹</span>
                      <input
                        type="number"
                        step="0.5"
                        value={currentRate}
                        onChange={(e) => handleRateChange(day.id, parseFloat(e.target.value) || 0)}
                        className="w-14 bg-transparent font-bold text-slate-900 focus:outline-none text-right"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Publishers */}
      {activeTab === 'publishers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publishers.map((pub) => (
            <div key={pub.publisher_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{pub.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {pub.category || 'Publisher'}
                </span>
              </div>
              <p className="text-slate-500">Location: {pub.city || 'HQ'}, {pub.state}</p>
              <p className="text-slate-500">Phone/Mobile: {pub.mobile || pub.phone || 'N/A'}</p>
              {pub.email && <p className="text-slate-500">Email: {pub.email}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Holidays */}
      {activeTab === 'holidays' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Publication Holidays Calendar (छुट्टी सूची)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Occasion</th>
                  <th className="py-2 px-3">Affected Publication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {holidays.map((h) => (
                  <tr key={h.holiday_id}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{h.oc_date}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-bold">{h.occasion}</td>
                    <td className="py-2.5 px-3 text-indigo-600">{h.publication_name || 'All Publications'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Supplements */}
      {activeTab === 'supplements' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Special Supplements (सप्लीमेंट विवरण)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Supplement Title</th>
                  <th className="py-2 px-3">Month / Year</th>
                  <th className="py-2 px-3">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {supplements.map((s) => (
                  <tr key={s.sup_id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.publication_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.month} {s.year}</td>
                    <td className="py-2.5 px-3 text-slate-500">{s.region_name || 'All Regions'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
