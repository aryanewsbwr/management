'use client';

import React, { useState } from 'react';
import { mockRegions } from '@/lib/mockData';
import { MapPin, Plus, Search, Save, Trash2, Edit, RefreshCw, X } from 'lucide-react';

export default function RegionDetailsPage() {
  const [regions, setRegions] = useState(mockRegions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [formData, setFormData] = useState({
    region_id: 0,
    region_name: '',
    name_hindi: '',
    zone: 'Zone 1'
  });

  const filteredRegions = regions.filter(r => 
    r.region_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.name_hindi && r.name_hindi.includes(searchTerm))
  );

  const handleSelect = (r: any) => {
    setSelectedRegion(r);
    setFormData({
      region_id: r.region_id,
      region_name: r.region_name,
      name_hindi: r.name_hindi || '',
      zone: r.zone || 'Zone 1'
    });
  };

  const handleNew = () => {
    const nextId = Math.max(...regions.map(r => r.region_id), 0) + 1;
    const newReg = { region_id: nextId, region_name: `New Region ${nextId}`, name_hindi: `नया क्षेत्र ${nextId}`, zone: 'Zone 1' };
    setSelectedRegion(newReg);
    setFormData(newReg);
  };

  const handleSave = () => {
    if (!formData.region_name) return;
    if (regions.some(r => r.region_id === formData.region_id)) {
      setRegions(regions.map(r => r.region_id === formData.region_id ? formData : r));
    } else {
      setRegions([...regions, formData]);
    }
    alert('Region Details Saved Successfully!');
  };

  const handleDelete = () => {
    if (!selectedRegion) return;
    if (confirm(`Delete Region: ${selectedRegion.region_name}?`)) {
      setRegions(regions.filter(r => r.region_id !== selectedRegion.region_id));
      setSelectedRegion(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-2">
      {/* Title Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>Option 3: Region Details (क्षेत्र / जोन विवरण)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage delivery areas and distribution zones ({regions.length} Records)</p>
        </div>
        <button 
          onClick={handleNew}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Region (नया क्षेत्र)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left List Pane */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Region Name / क्षेत्र खोजें..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-indigo-600"
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-1 divide-y divide-slate-100">
            {filteredRegions.map((reg) => (
              <div 
                key={reg.region_id}
                onClick={() => handleSelect(reg)}
                className={`p-2.5 rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-between ${
                  selectedRegion?.region_id === reg.region_id ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <p className="font-bold">{reg.region_name}</p>
                  {reg.name_hindi && <p className="text-[11px] text-slate-500">{reg.name_hindi}</p>}
                </div>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                  ID #{reg.region_id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Editor Pane */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-200">
            {selectedRegion ? `Edit Region ID #${selectedRegion.region_id}` : 'Select a Region or Click Add New'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Region ID (क्षेत्र कोड)</label>
              <input 
                type="text" 
                disabled 
                value={formData.region_id || ''} 
                className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Zone (जोन)</label>
              <select 
                value={formData.zone} 
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800"
              >
                <option value="Zone 1">Zone 1 (Main City)</option>
                <option value="Zone 2">Zone 2 (Outer Colony)</option>
                <option value="Zone 3">Zone 3 (Rural Routes)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Region Name English (अंग्रेजी नाम)</label>
              <input 
                type="text" 
                value={formData.region_name} 
                onChange={(e) => setFormData({ ...formData, region_name: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Region Name Hindi (हिंदी नाम)</label>
              <input 
                type="text" 
                value={formData.name_hindi} 
                onChange={(e) => setFormData({ ...formData, name_hindi: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Action Bar matching 2008 VB6 Form */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save (सहेजें)
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded flex items-center gap-1.5">
              <Edit className="w-4 h-4" /> Update (बदलें)
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" /> Delete (हटाएं)
            </button>
            <button onClick={() => setSelectedRegion(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded flex items-center gap-1.5">
              <X className="w-4 h-4" /> Clear (साफ करें)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
