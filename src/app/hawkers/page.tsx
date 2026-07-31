'use client';

import React, { useState } from 'react';
import { Truck, Plus, Phone, MapPin, Navigation, BookOpen, Map, Search, Trash2, X } from 'lucide-react';
import { mockHawkers, mockRegions, mockCollectors, mockReceiptIssues } from '@/lib/mockData';
import { Hawker, Collector, ReceiptIssue, Region } from '@/lib/types';

import { useSearchParams } from 'next/navigation';

export default function HawkersPage() {
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const initialTab = tabQuery === 'regions' ? 'regions' : tabQuery === 'collectors' ? 'collectors' : 'hawkers';

  const [activeTab, setActiveTab] = useState<'hawkers' | 'regions' | 'collectors'>(initialTab);
  const [hawkers, setHawkers] = useState<Hawker[]>(mockHawkers);
  const [regions, setRegions] = useState<Region[]>(mockRegions);
  const [collectors] = useState<Collector[]>(mockCollectors);
  const [issues, setIssues] = useState<ReceiptIssue[]>(mockReceiptIssues);

  const [isHawkerModalOpen, setIsHawkerModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  
  const [regionSearch, setRegionSearch] = useState('');

  // Hawker Form State (Matching Screenshot 4)
  const [hawkerForm, setHawkerForm] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    mobile: '',
    assigned_regions: [1] as number[] // Multi-select assigned regions
  });

  // Region Master Form State (Matching Screenshot 3)
  const [newRegionName, setNewRegionName] = useState('');

  // Receipt Allotment Form State (Matching Screenshot 12)
  const [receiptForm, setReceiptForm] = useState({
    collect_id: 1,
    receipt_from: 101,
    receipt_to: 200,
    issue_date: new Date().toISOString().split('T')[0]
  });

  const toggleHawkerRegion = (regId: number) => {
    setHawkerForm(prev => {
      const exists = prev.assigned_regions.includes(regId);
      if (exists) {
        if (prev.assigned_regions.length === 1) return prev;
        return { ...prev, assigned_regions: prev.assigned_regions.filter(id => id !== regId) };
      } else {
        return { ...prev, assigned_regions: [...prev.assigned_regions, regId] };
      }
    });
  };

  const handleAddHawker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hawkerForm.name.trim()) return;

    const firstRegName = regions.find(r => r.region_id === hawkerForm.assigned_regions[0])?.region_name || 'Central Zone';

    const newHawker: Hawker = {
      hawker_id: hawkers.length + 1,
      name: hawkerForm.name,
      address: hawkerForm.address,
      city: hawkerForm.city,
      phone: hawkerForm.phone,
      mobile: hawkerForm.mobile,
      assigned_regions: hawkerForm.assigned_regions,
      region_name: firstRegName
    };

    setHawkers([...hawkers, newHawker]);
    setIsHawkerModalOpen(false);
  };

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName.trim()) return;

    const newReg: Region = {
      region_id: regions.length + 1,
      region_name: newRegionName.trim()
    };

    setRegions([...regions, newReg]);
    setNewRegionName('');
    setIsRegionModalOpen(false);
  };

  const handleAddReceiptIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const colName = collectors.find(c => c.collect_id === Number(receiptForm.collect_id))?.name;

    const newIssue: ReceiptIssue = {
      issue_id: issues.length + 1,
      collect_id: Number(receiptForm.collect_id),
      collector_name: colName,
      receipt_from: Number(receiptForm.receipt_from),
      receipt_to: Number(receiptForm.receipt_to),
      issue_date: receiptForm.issue_date
    };

    setIssues([...issues, newIssue]);
    setIsReceiptModalOpen(false);
  };

  const filteredRegions = regions.filter(r => r.region_name.toLowerCase().includes(regionSearch.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hawkers & Route Distribution</h1>
          <p className="text-xs text-slate-500">Hawker route boys, region masters, collectors & receipt book allotments</p>
        </div>
        {activeTab === 'hawkers' ? (
          <button
            onClick={() => setIsHawkerModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hawker</span>
          </button>
        ) : activeTab === 'regions' ? (
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Region</span>
          </button>
        ) : (
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Receipt Book</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hawkers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'hawkers'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Hawker Delivery Boys</span>
        </button>

        <button
          onClick={() => setActiveTab('regions')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'regions'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Region Master ({regions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collectors')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'collectors'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Collectors & Receipt Books</span>
        </button>
      </div>

      {/* Tab 1: Hawkers (Screenshot 4) */}
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
                  <span className="font-bold text-indigo-600">{hawker.region_name || 'Assigned Routes'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Mobile: {hawker.mobile || hawker.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Address: {hawker.address || 'Local Route'}{hawker.city ? `, ${hawker.city}` : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Region Master (Screenshot 3 & 3region.csv) */}
      {activeTab === 'regions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                placeholder="Search Region Name..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
              />
            </div>
            <button
              onClick={() => setIsRegionModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs"
            >
              + Add Region
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredRegions.map((reg) => (
              <div key={reg.region_id} className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{reg.region_name}</span>
                <span className="text-[10px] text-slate-400 font-medium">#{reg.region_id}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Collectors & Receipt Books (Screenshot 12) */}
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
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Issued Receipt Books Log (Receipt Allotment)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2 px-3">SNO</th>
                    <th className="py-2 px-3">Collector Name</th>
                    <th className="py-2 px-3">Receipt From</th>
                    <th className="py-2 px-3">Receipt To</th>
                    <th className="py-2 px-3">Allot.Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {issues.map((iss, idx) => (
                    <tr key={iss.issue_id}>
                      <td className="py-2 px-3 font-semibold text-slate-900">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-indigo-600">{iss.collector_name}</td>
                      <td className="py-2 px-3 font-mono text-slate-800 font-bold">{iss.receipt_from}</td>
                      <td className="py-2 px-3 font-mono text-slate-800 font-bold">{iss.receipt_to}</td>
                      <td className="py-2 px-3 text-slate-500">{iss.issue_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Hawker Add Modal with Multi-Region Checkbox List (Screenshot 4) */}
      {isHawkerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Hawker Detail (Add New Delivery Hawker)</h3>
              <button onClick={() => setIsHawkerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHawker} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Hawker Name *</label>
                <input
                  type="text"
                  required
                  value={hawkerForm.name}
                  onChange={(e) => setHawkerForm({ ...hawkerForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={hawkerForm.address}
                  onChange={(e) => setHawkerForm({ ...hawkerForm, address: e.target.value })}
                  placeholder="Quarter 42, Civil Lines"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={hawkerForm.city}
                    onChange={(e) => setHawkerForm({ ...hawkerForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={hawkerForm.phone}
                    onChange={(e) => setHawkerForm({ ...hawkerForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mobile</label>
                  <input
                    type="text"
                    value={hawkerForm.mobile}
                    onChange={(e) => setHawkerForm({ ...hawkerForm, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Multi-Select Assigned Regions Checkbox Table (Screenshot 4) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Assigned Regions / Routes</label>
                <div className="border border-slate-200 rounded-lg max-h-36 overflow-y-auto p-2 space-y-1 bg-slate-50">
                  {regions.map((reg) => {
                    const isChecked = hawkerForm.assigned_regions.includes(reg.region_id);
                    return (
                      <label key={reg.region_id} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:bg-slate-100 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleHawkerRegion(reg.region_id)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <span>{reg.region_name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHawkerModalOpen(false)}
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

      {/* Region Add Modal (Screenshot 3) */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Region Detail (Add Region)</h3>
              <button onClick={() => setIsRegionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRegion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Region Name *</label>
                <input
                  type="text"
                  required
                  value={newRegionName}
                  onChange={(e) => setNewRegionName(e.target.value)}
                  placeholder="e.g. Civil Lines Zone 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegionModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Region
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Book Allotment Modal (Screenshot 12) */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Receipt Allotment (Issue Book)</h3>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReceiptIssue} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Collector Name</label>
                <select
                  value={receiptForm.collect_id}
                  onChange={(e) => setReceiptForm({ ...receiptForm, collect_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                >
                  {collectors.map(c => (
                    <option key={c.collect_id} value={c.collect_id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Receipt From</label>
                  <input
                    type="number"
                    value={receiptForm.receipt_from}
                    onChange={(e) => setReceiptForm({ ...receiptForm, receipt_from: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Receipt To</label>
                  <input
                    type="number"
                    value={receiptForm.receipt_to}
                    onChange={(e) => setReceiptForm({ ...receiptForm, receipt_to: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Allotment Date</label>
                <input
                  type="date"
                  value={receiptForm.issue_date}
                  onChange={(e) => setReceiptForm({ ...receiptForm, issue_date: e.target.value })}
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
                  Issue Receipt Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
