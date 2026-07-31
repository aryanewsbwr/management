'use client';

import React, { useState } from 'react';
import { Newspaper, Calendar, Building2, Plus, Sun, Layers, Edit, X, Search, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockPublications, mockPublicationRates, mockPublishers, mockHolidays, mockPublicationSups } from '@/lib/mockData';
import { Publication, PublicationRate, Publisher, Holiday, PublicationSup, RateChange, PublicationDiscontinue } from '@/lib/types';
import { transliterateToHindi } from '@/lib/transliteration';

const weekDays = [
  { id: 7, name: 'Sunday (रविवार)' },
  { id: 1, name: 'Monday (सोमवार)' },
  { id: 2, name: 'Tuesday (मंगलवार)' },
  { id: 3, name: 'Wednesday (बुधवार)' },
  { id: 4, name: 'Thursday (गुरुवार)' },
  { id: 5, name: 'Friday (शुक्रवार)' },
  { id: 6, name: 'Saturday (शनिवार)' },
];

import { useSearchParams } from 'next/navigation';

export default function PublicationsPage() {
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');
  
  const initialTab = tabQuery === 'publishers' ? 'publishers' 
    : tabQuery === 'ratechanges' ? 'ratechanges'
    : tabQuery === 'holidays' ? 'holidays'
    : tabQuery === 'suspensions' ? 'press_discontinue'
    : 'rates';

  const [activeTab, setActiveTab] = useState<'rates' | 'publishers' | 'ratechanges' | 'holidays' | 'press_discontinue' | 'supplements'>(initialTab);
  const [publications, setPublications] = useState<Publication[]>(mockPublications);
  const [rates, setRates] = useState<PublicationRate[]>(mockPublicationRates);
  const [publishers, setPublishers] = useState<Publisher[]>(mockPublishers);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [supplements] = useState<PublicationSup[]>(mockPublicationSups);

  // Rate Changes Log (Screenshot 6)
  const [rateChanges, setRateChanges] = useState<RateChange[]>([
    { change_id: 1, publication_id: 1, publication_name: 'Dainik Bhaskar', type_p: 'Daily', old_rate: 5.00, new_rate: 7.00, effective_date: '2026-07-01', day_of_week: 7 }
  ]);

  // Press Discontinuations (Screenshot 11)
  const [pressDiscontinues, setPressDiscontinues] = useState<PublicationDiscontinue[]>([
    { pub_discontinue_id: 1, publication_id: 2, publication_name: 'Dainik Jagran', from_date: '2026-08-15', to_date: '2026-08-16' }
  ]);

  const [selectedPub, setSelectedPub] = useState<Publication>(mockPublications[0]);
  
  // Publication Edit/Add Modals (Screenshot 2)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);

  // Publisher Edit/Add Modals (Screenshot 1)
  const [publisherSearch, setPublisherSearch] = useState('');
  const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);

  // Holiday Modal (Screenshot 7)
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayForm, setHolidayForm] = useState({
    oc_date: new Date().toISOString().split('T')[0],
    occasion: '',
    affected_publications: [] as number[]
  });

  // Press Discontinue Modal (Screenshot 11)
  const [isPressDiscontinueModalOpen, setIsPressDiscontinueModalOpen] = useState(false);
  const [pressDiscontinueForm, setPressDiscontinueForm] = useState({
    publication_id: 1,
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0]
  });

  const [publisherForm, setPublisherForm] = useState<Publisher>({
    publisher_id: 0,
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    website: '',
    category: 'Newspaper',
    type: 'Publisher'
  });

  const [pubForm, setPubForm] = useState<Publication>({
    publication_id: 0,
    public_name: '',
    pub_hindi: '',
    type_p: 'Daily',
    publisher_id: 1,
    abrv: '',
    circulation: 'Morning',
    chr_del: true,
    rate: 5.00,
    duration: 'Monthly',
    pub_day: 'All Days',
    pub_month: 'All Months'
  });

  const pubRates = rates.filter(r => r.publication_id === selectedPub.publication_id);

  // Auto Hindi Transliteration for Publication Name
  const handleNameChange = (val: string) => {
    const hindi = transliterateToHindi(val);
    setPubForm(prev => ({ ...prev, public_name: val, pub_hindi: hindi }));
  };

  const handleOpenEdit = (pub: Publication) => {
    setEditingPub(pub);
    setPubForm({ ...pub });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPub || !pubForm.public_name.trim()) return;

    const updatedList = publications.map(p => p.publication_id === editingPub.publication_id ? pubForm : p);
    setPublications(updatedList);
    setSelectedPub(pubForm);
    setIsEditModalOpen(false);
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.public_name.trim()) return;

    const newId = publications.length + 1;
    const newPub: Publication = {
      ...pubForm,
      publication_id: newId,
      abrv: pubForm.abrv || pubForm.public_name.substring(0, 3).toUpperCase()
    };

    setPublications([...publications, newPub]);
    setSelectedPub(newPub);
    setIsAddModalOpen(false);
  };

  // Publisher Handlers (Screenshot 1)
  const handleOpenAddPublisher = () => {
    setEditingPublisher(null);
    setPublisherForm({
      publisher_id: publishers.length + 1,
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      mobile: '',
      fax: '',
      email: '',
      website: '',
      category: 'Newspaper',
      type: 'Publisher'
    });
    setIsPublisherModalOpen(true);
  };

  const handleSavePublisher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publisherForm.name.trim()) return;

    if (editingPublisher) {
      setPublishers(publishers.map(p => p.publisher_id === editingPublisher.publisher_id ? publisherForm : p));
    } else {
      setPublishers([...publishers, { ...publisherForm, publisher_id: publishers.length + 1 }]);
    }
    setIsPublisherModalOpen(false);
  };

  // Holiday Multi-Select Handlers (Screenshot 7)
  const handleToggleHolidayPub = (id: number) => {
    setHolidayForm(prev => {
      const exists = prev.affected_publications.includes(id);
      if (exists) {
        return { ...prev, affected_publications: prev.affected_publications.filter(p => p !== id) };
      } else {
        return { ...prev, affected_publications: [...prev.affected_publications, id] };
      }
    });
  };

  const handleApplyAllNewspaper = () => {
    const newspaperIds = publications.filter(p => p.type_p === 'Daily').map(p => p.publication_id);
    setHolidayForm(prev => ({ ...prev, affected_publications: newspaperIds }));
  };

  const handleApplyAllMagazine = () => {
    const magIds = publications.filter(p => p.type_p !== 'Daily').map(p => p.publication_id);
    setHolidayForm(prev => ({ ...prev, affected_publications: magIds }));
  };

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayForm.occasion.trim()) return;

    const newHoliday: Holiday = {
      holiday_id: holidays.length + 1,
      occasion: holidayForm.occasion,
      oc_date: holidayForm.oc_date,
      affected_publications: holidayForm.affected_publications,
      publication_name: holidayForm.affected_publications.length === publications.length ? 'All Publications' : `${holidayForm.affected_publications.length} Selected Papers`
    };

    setHolidays([...holidays, newHoliday]);
    setIsHolidayModalOpen(false);
  };

  // Press Discontinue Handler (Screenshot 11)
  const handleSavePressDiscontinue = (e: React.FormEvent) => {
    e.preventDefault();
    const pubName = publications.find(p => p.publication_id === Number(pressDiscontinueForm.publication_id))?.public_name;

    const newDis: PublicationDiscontinue = {
      pub_discontinue_id: pressDiscontinues.length + 1,
      publication_id: Number(pressDiscontinueForm.publication_id),
      publication_name: pubName,
      from_date: pressDiscontinueForm.from_date,
      to_date: pressDiscontinueForm.to_date
    };

    setPressDiscontinues([...pressDiscontinues, newDis]);
    setIsPressDiscontinueModalOpen(false);
  };

  const filteredPublishers = publishers.filter(p =>
    p.name.toLowerCase().includes(publisherSearch.toLowerCase()) ||
    (p.city && p.city.toLowerCase().includes(publisherSearch.toLowerCase()))
  );

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
          <h1 className="text-xl font-bold text-slate-900">Publications & Press Master</h1>
          <p className="text-xs text-slate-500">Publication rates, publishers directory, rate changes log, holidays & press suspensions</p>
        </div>
        {activeTab === 'rates' ? (
          <button
            onClick={() => {
              setPubForm({ publication_id: 0, public_name: '', pub_hindi: '', type_p: 'Daily', publisher_id: 1, abrv: '', circulation: 'Morning', chr_del: true, rate: 5.00, duration: 'Monthly', pub_day: 'All Days', pub_month: 'All Months' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Publication</span>
          </button>
        ) : activeTab === 'publishers' ? (
          <button
            onClick={handleOpenAddPublisher}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Publisher / Dealer</span>
          </button>
        ) : activeTab === 'holidays' ? (
          <button
            onClick={() => setIsHolidayModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Define Holiday</span>
          </button>
        ) : activeTab === 'press_discontinue' ? (
          <button
            onClick={() => setIsPressDiscontinueModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Discontinue Publication</span>
          </button>
        ) : null}
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
          <span>Publishers Directory ({publishers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ratechanges')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'ratechanges'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Rate Changes Log</span>
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
          onClick={() => setActiveTab('press_discontinue')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'press_discontinue'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Press Suspensions</span>
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

      {/* Tab 1: Active Publications & Weekdays Rate Matrix (Screenshot 2) */}
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
                <p className="text-xs text-slate-500">
                  Circulation: {selectedPub.circulation} • Frequency: {selectedPub.type_p} • Del Charges: {selectedPub.chr_del ? 'Yes' : 'No'}
                </p>
              </div>
              <button
                onClick={() => handleOpenEdit(selectedPub)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
            </div>

            {/* Weekdays Rate Grid (Matching Screenshot 2) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Weekdays Rate Matrix</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weekDays.map((day) => {
                  const currentRate = pubRates.find(r => r.day_of_week === day.id)?.rate || 5.00;
                  return (
                    <div key={day.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{day.name}</p>
                        <p className="text-[11px] text-slate-400">Copy rate</p>
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
        </div>
      )}

      {/* Tab 2: Publishers Directory (Screenshot 1 & 1publisher.csv) */}
      {activeTab === 'publishers' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={publisherSearch}
              onChange={(e) => setPublisherSearch(e.target.value)}
              placeholder="Find Publisher by Name, City, or Category..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPublishers.map((pub) => (
              <div key={pub.publisher_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      ID #{pub.publisher_id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{pub.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingPublisher(pub); setPublisherForm({...pub}); setIsPublisherModalOpen(true); }}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Cat: {pub.category || 'Both'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Type: {pub.type || 'Publisher'}
                  </span>
                </div>

                <div className="text-slate-500 space-y-0.5 pt-1 text-[11px]">
                  {pub.address && <p>Address: {pub.address}</p>}
                  <p>City/State: {pub.city || 'N/A'}{pub.state ? `, ${pub.state}` : ''} {pub.pincode ? `(${pub.pincode})` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Rate Changes Log (Screenshot 6) */}
      {activeTab === 'ratechanges' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Historical Rate Changes Log (दर परिवर्तन विवरण)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Publication</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Day of Week</th>
                  <th className="py-2 px-3 text-right">Old Rate</th>
                  <th className="py-2 px-3 text-right">New Rate</th>
                  <th className="py-2 px-3">Effective Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {rateChanges.map((rc) => (
                  <tr key={rc.change_id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{rc.publication_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{rc.type_p}</td>
                    <td className="py-2.5 px-3 text-indigo-600 font-semibold">{weekDays.find(w => w.id === rc.day_of_week)?.name || 'Sunday'}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">₹{rc.old_rate.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-600">₹{rc.new_rate.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rc.effective_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Holidays (Screenshot 7) */}
      {activeTab === 'holidays' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Define Holiday (छुट्टी सूची)</h3>
            <button
              onClick={() => setIsHolidayModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs"
            >
              + Define Holiday
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Occasion</th>
                  <th className="py-2 px-3">Affected Publications</th>
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

      {/* Tab 5: Press Discontinuations (Screenshot 11) */}
      {activeTab === 'press_discontinue' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Press Suspations / Publication Discontinues</h3>
            <button
              onClick={() => setIsPressDiscontinueModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-xs"
            >
              + Add Press Stop
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Publication Name</th>
                  <th className="py-2 px-3">From Date</th>
                  <th className="py-2 px-3">To Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pressDiscontinues.map((pd) => (
                  <tr key={pd.pub_discontinue_id}>
                    <td className="py-2.5 px-3 font-bold text-rose-700">{pd.publication_name}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{pd.from_date}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{pd.to_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Supplements */}
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

      {/* Publication Edit/Add Modal (Screenshot 2) */}
      {(isEditModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">{isEditModalOpen ? 'Publication Info (Edit)' : 'Publication Info (Add)'}</h3>
              <button onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={isEditModalOpen ? handleSaveEdit : handleAddPublication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publication Name *</label>
                <input
                  type="text"
                  required
                  value={pubForm.public_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Dainik Bhaskar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pub. Name Hindi (हिंदी नाम)</label>
                <input
                  type="text"
                  value={pubForm.pub_hindi || ''}
                  onChange={(e) => setPubForm({ ...pubForm, pub_hindi: e.target.value })}
                  placeholder="दैनिक भास्कर"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Abrevation</label>
                  <input
                    type="text"
                    value={pubForm.abrv || ''}
                    onChange={(e) => setPubForm({ ...pubForm, abrv: e.target.value })}
                    placeholder="DB"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Publisher</label>
                  <select
                    value={pubForm.publisher_id}
                    onChange={(e) => setPubForm({ ...pubForm, publisher_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    {publishers.map(p => (
                      <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Type</label>
                  <select
                    value={pubForm.type_p}
                    onChange={(e) => setPubForm({ ...pubForm, type_p: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Magazine">Magazine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Circulation</label>
                  <select
                    value={pubForm.circulation}
                    onChange={(e) => setPubForm({ ...pubForm, circulation: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chr_del_chk"
                  checked={pubForm.chr_del}
                  onChange={(e) => setPubForm({ ...pubForm, chr_del: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <label htmlFor="chr_del_chk" className="text-slate-700 font-bold">Del. Charges Applicable</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Define Holiday Modal (Screenshot 7) */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Define Holiday Info</h3>
              <button onClick={() => setIsHolidayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHoliday} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={holidayForm.oc_date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, oc_date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Occasion Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Main Day"
                  value={holidayForm.occasion}
                  onChange={(e) => setHolidayForm({ ...holidayForm, occasion: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Multi-Select Publication Checkbox Table (Screenshot 7) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 font-bold">Affected Publications</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleApplyAllNewspaper}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      Apply All Newspaper (F1)
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyAllMagazine}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      Apply All Magzine (F2)
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1 bg-slate-50">
                  {publications.map((pub) => {
                    const isChecked = holidayForm.affected_publications.includes(pub.publication_id);
                    return (
                      <label key={pub.publication_id} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:bg-slate-100 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleHolidayPub(pub.publication_id)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <span>{pub.public_name} ({pub.type_p})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Press Discontinue Modal (Screenshot 11) */}
      {isPressDiscontinueModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-md rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Publications Discontinue (Press Stop)</h3>
              <button onClick={() => setIsPressDiscontinueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePressDiscontinue} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publication Name</label>
                <select
                  value={pressDiscontinueForm.publication_id}
                  onChange={(e) => setPressDiscontinueForm({ ...pressDiscontinueForm, publication_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                >
                  {publications.map(p => (
                    <option key={p.publication_id} value={p.publication_id}>{p.public_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={pressDiscontinueForm.from_date}
                    onChange={(e) => setPressDiscontinueForm({ ...pressDiscontinueForm, from_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={pressDiscontinueForm.to_date}
                    onChange={(e) => setPressDiscontinueForm({ ...pressDiscontinueForm, to_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPressDiscontinueModalOpen(false)}
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

      {/* Publisher Modal (Screenshot 1) */}
      {isPublisherModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-xl shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">{editingPublisher ? 'Publisher Info (Edit)' : 'Publisher Info (Add)'}</h3>
              <button onClick={() => setIsPublisherModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePublisher} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Publisher Name *</label>
                <input
                  type="text"
                  required
                  value={publisherForm.name}
                  onChange={(e) => setPublisherForm({ ...publisherForm, name: e.target.value })}
                  placeholder="e.g. BENNETT COLEMAN & CO. LTD."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={publisherForm.address || ''}
                  onChange={(e) => setPublisherForm({ ...publisherForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={publisherForm.city || ''}
                    onChange={(e) => setPublisherForm({ ...publisherForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={publisherForm.state || ''}
                    onChange={(e) => setPublisherForm({ ...publisherForm, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pincode</label>
                  <input
                    type="text"
                    value={publisherForm.pincode || ''}
                    onChange={(e) => setPublisherForm({ ...publisherForm, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={publisherForm.phone || ''}
                    onChange={(e) => setPublisherForm({ ...publisherForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mobile</label>
                  <input
                    type="text"
                    value={publisherForm.mobile || ''}
                    onChange={(e) => setPublisherForm({ ...publisherForm, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fax</label>
                  <input
                    type="text"
                    value={publisherForm.fax || ''}
                    onChange={(e) => setPublisherForm({ ...publisherForm, fax: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={publisherForm.category}
                    onChange={(e) => setPublisherForm({ ...publisherForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Newspaper">Newspaper</option>
                    <option value="Magzine">Magzine</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Type</label>
                  <select
                    value={publisherForm.type}
                    onChange={(e) => setPublisherForm({ ...publisherForm, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Publisher">Publisher</option>
                    <option value="Dealer">Dealer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublisherModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Publisher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
