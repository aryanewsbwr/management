'use client';

import React, { useState } from 'react';
import { Newspaper, Calendar, Building2, Plus, Sun, Layers, Edit, X } from 'lucide-react';
import { mockPublications, mockPublicationRates, mockPublishers, mockHolidays, mockPublicationSups } from '@/lib/mockData';
import { Publication, PublicationRate, Publisher, Holiday, PublicationSup } from '@/lib/types';
import { transliterateToHindi } from '@/lib/transliteration';

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
  const [publications, setPublications] = useState<Publication[]>(mockPublications);
  const [rates, setRates] = useState<PublicationRate[]>(mockPublicationRates);
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [holidays] = useState<Holiday[]>(mockHolidays);
  const [supplements] = useState<PublicationSup[]>(mockPublicationSups);

  const [selectedPub, setSelectedPub] = useState<Publication>(mockPublications[0]);
  
  // Modal states for Editing & Creating Publications
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);

  const [pubForm, setPubForm] = useState<{
    public_name: string;
    pub_hindi: string;
    type_p: 'Daily' | 'Weekly' | 'Monthly' | 'Magazine';
    publisher_id: number;
    abrv: string;
    circulation: 'Morning' | 'Evening';
    chr_del: boolean;
  }>({
    public_name: '',
    pub_hindi: '',
    type_p: 'Daily',
    publisher_id: 1,
    abrv: '',
    circulation: 'Morning',
    chr_del: true
  });

  const pubRates = rates.filter(r => r.publication_id === selectedPub.publication_id);

  // Auto Hindi Transliteration for Publication Name
  const handleNameChange = async (val: string) => {
    setPubForm(prev => ({ ...prev, public_name: val }));
    if (val.trim()) {
      const hindi = await transliterateToHindi(val);
      setPubForm(prev => ({ ...prev, pub_hindi: hindi }));
    }
  };

  const handleOpenEdit = (pub: Publication) => {
    setEditingPub(pub);
    setPubForm({
      public_name: pub.public_name,
      pub_hindi: pub.pub_hindi || '',
      type_p: pub.type_p,
      publisher_id: pub.publisher_id || 1,
      abrv: pub.abrv,
      circulation: pub.circulation,
      chr_del: pub.chr_del
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPub || !pubForm.public_name.trim()) return;

    const updatedList = publications.map(p => {
      if (p.publication_id === editingPub.publication_id) {
        return {
          ...p,
          public_name: pubForm.public_name,
          pub_hindi: pubForm.pub_hindi,
          type_p: pubForm.type_p,
          publisher_id: Number(pubForm.publisher_id),
          abrv: pubForm.abrv,
          circulation: pubForm.circulation,
          chr_del: pubForm.chr_del
        };
      }
      return p;
    });

    setPublications(updatedList);
    const updatedSelected = updatedList.find(p => p.publication_id === editingPub.publication_id);
    if (updatedSelected) setSelectedPub(updatedSelected);
    setIsEditModalOpen(false);
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.public_name.trim()) return;

    const newId = publications.length + 1;
    const newPub: Publication = {
      publication_id: newId,
      public_name: pubForm.public_name,
      pub_hindi: pubForm.pub_hindi,
      type_p: pubForm.type_p,
      publisher_id: Number(pubForm.publisher_id),
      abrv: pubForm.abrv || pubForm.public_name.substring(0, 3).toUpperCase(),
      circulation: pubForm.circulation,
      chr_del: pubForm.chr_del
    };

    setPublications([...publications, newPub]);
    setSelectedPub(newPub);
    setIsAddModalOpen(false);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Publications & Rates</h1>
          <p className="text-xs text-slate-500">Manage newspapers, day-of-week rates, publishers, holidays & supplements</p>
        </div>
        <button
          onClick={() => {
            setPubForm({ public_name: '', pub_hindi: '', type_p: 'Daily', publisher_id: 1, abrv: '', circulation: 'Morning', chr_del: true });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Publication</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('rates')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'rates'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Active Publications & Rates</span>
        </button>

        <button
          onClick={() => setActiveTab('publishers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
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
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
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
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'supplements'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Supplements</span>
        </button>
      </div>

      {/* Tab 1: Active Publications & Rates */}
      {activeTab === 'rates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Active Paper</p>
            <div className="space-y-1">
              {publications.map((pub) => {
                const isSelected = pub.publication_id === selectedPub.publication_id;
                return (
                  <div
                    key={pub.publication_id}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-100'
                    }`}
                  >
                    <button 
                      onClick={() => setSelectedPub(pub)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <p className="font-bold">{pub.public_name}</p>
                      <p className="text-[11px] text-slate-400 font-normal">{pub.pub_hindi} • {pub.type_p}</p>
                    </button>
                    
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                        {pub.abrv}
                      </span>
                      <button
                        onClick={() => handleOpenEdit(pub)}
                        title="Edit Publication"
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
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
              <button
                onClick={() => handleOpenEdit(selectedPub)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
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

      {/* Edit Publication Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Publication Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publication Name (English) *</label>
                <input
                  type="text"
                  required
                  value={pubForm.public_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Hindi Name (हिंदी नाम)</label>
                <input
                  type="text"
                  value={pubForm.pub_hindi}
                  onChange={(e) => setPubForm({ ...pubForm, pub_hindi: e.target.value })}
                  placeholder="Auto-translated in Hindi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Frequency / Type</label>
                  <select
                    value={pubForm.type_p}
                    onChange={(e) => setPubForm({ ...pubForm, type_p: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Daily">Daily Newspaper</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Magazine">Magazine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Abbreviation</label>
                  <input
                    type="text"
                    value={pubForm.abrv}
                    onChange={(e) => setPubForm({ ...pubForm, abrv: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Circulation Time</label>
                  <select
                    value={pubForm.circulation}
                    onChange={(e) => setPubForm({ ...pubForm, circulation: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Delivery Charge</label>
                  <select
                    value={pubForm.chr_del ? 'true' : 'false'}
                    onChange={(e) => setPubForm({ ...pubForm, chr_del: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="true">Applicable</option>
                    <option value="false">Free / None</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Publication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Create New Publication</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddPublication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publication Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hindustan Times"
                  value={pubForm.public_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Hindi Name (हिंदी नाम)</label>
                <input
                  type="text"
                  value={pubForm.pub_hindi}
                  onChange={(e) => setPubForm({ ...pubForm, pub_hindi: e.target.value })}
                  placeholder="Auto-translated in Hindi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Frequency / Type</label>
                  <select
                    value={pubForm.type_p}
                    onChange={(e) => setPubForm({ ...pubForm, type_p: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Daily">Daily Newspaper</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Magazine">Magazine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Abbreviation</label>
                  <input
                    type="text"
                    placeholder="HT"
                    value={pubForm.abrv}
                    onChange={(e) => setPubForm({ ...pubForm, abrv: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Add Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
