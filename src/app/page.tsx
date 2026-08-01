'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building, 
  Newspaper, 
  MapPin, 
  Truck, 
  Users, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  Receipt, 
  PauseCircle, 
  Scissors, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Printer,
  ChevronRight
} from 'lucide-react';

const simpleMenuItems = [
  { num: '1', name: 'Publisher Info', hindi: '1. प्रकाशक जानकारी', desc: 'Add or view newspaper publishers', href: '/publications?tab=publishers', icon: Building, color: 'bg-blue-600' },
  { num: '2', name: 'Publication Info', hindi: '2. अखबार एवं दर जानकारी', desc: 'Newspaper names & weekly rates', href: '/publications?tab=active', icon: Newspaper, color: 'bg-indigo-600' },
  { num: '3', name: 'Region Details', hindi: '3. क्षेत्र / जोन जानकारी', desc: 'City areas & distribution zones', href: '/hawkers?tab=regions', icon: MapPin, color: 'bg-purple-600' },
  { num: '4', name: 'Hawker Details', hindi: '4. हॉकर (पेपर बांटने वाले)', desc: 'Hawker delivery boys & routes', href: '/hawkers?tab=hawkers', icon: Truck, color: 'bg-sky-600' },
  { num: '5', name: 'Customer Info', hindi: '5. ग्राहक जानकारी एवं पेपर जोड़ें', desc: 'Add customers, Hindi name & papers', href: '/customers?tab=customers', icon: Users, color: 'bg-emerald-600' },
  { num: '6', name: 'Rate Changes Info', hindi: '6. रेट में बदलाव', desc: 'Change price rate per weekday', href: '/publications?tab=ratechanges', icon: DollarSign, color: 'bg-amber-600' },
  { num: '7', name: 'Define Holiday', hindi: '7. त्यौहार / प्रेस छुट्टी', desc: 'Festival holidays & press stop', href: '/publications?tab=holidays', icon: Calendar, color: 'bg-orange-600' },
  { num: '8', name: 'Purchase Invoice', hindi: '8. अखबार खरीद इनवॉइस', desc: 'Stock purchases from publishers', href: '/countersales?tab=purchases', icon: ShoppingBag, color: 'bg-rose-600' },
  { num: '9', name: 'Retail Sale', hindi: '9. काउंटर नकद बिक्री', desc: 'Direct OTC paper sales to walk-ins', href: '/countersales?tab=sales', icon: Receipt, color: 'bg-teal-600' },
  { num: '10', name: 'Discontinue Info', hindi: '10. ग्राहक वैकेशन स्टॉप (छुट्टी)', desc: 'Stop paper temporarily or permanently', href: '/customers?tab=discontinue', icon: PauseCircle, color: 'bg-yellow-600' },
  { num: '11', name: 'Publication Discontinue', hindi: '11. प्रेस सस्पेंशन / बंद अखबार', desc: 'Stop printing a paper for days', href: '/publications?tab=suspensions', icon: Scissors, color: 'bg-fuchsia-600' },
  { num: '12', name: 'Receipt Allotment', hindi: '12. रसीद बुक आवंटन', desc: 'Give receipt books to collectors', href: '/hawkers?tab=collectors', icon: BookOpen, color: 'bg-cyan-600' },
  { num: '13', name: 'Payment Receipt Entry', hindi: '13. भुगतान रसीद काटना (पेमेंट)', desc: 'Customer payment entry (Cash/Cheque)', href: '/billing?tab=receipts', icon: CreditCard, color: 'bg-emerald-700' },
  { num: '14', name: 'Bill Processing', hindi: '14. महीने का बिल जनरेट करें', desc: 'Calculate monthly bills by region', href: '/billing?tab=bills', icon: FileText, color: 'bg-blue-700' },
  { num: '15', name: 'Sticker & Reports', hindi: '15. प्रिंट रिपोर्ट एवं स्टिकर', desc: 'Print bill, stickers & hawker sheets', href: '/reports?tab=hawker_sheet', icon: Printer, color: 'bg-slate-800' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30 uppercase tracking-wider">
            सरल मोड (Easy Non-Tech Mode)
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">आर्यन न्यूज़ एजेंसी - मुख्य मेनू</h1>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Aryan News Agency Software — नीचे दिए गए किसी भी बटन पर क्लिक करें
          </p>
        </div>
      </div>

      {/* Main Menu Big Button Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {simpleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.num}
              href={item.href}
              className="group p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-600 shadow-xs hover:shadow-xl transition-all duration-200 flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Option #{item.num}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h2 className="text-base font-black text-slate-900 mt-1 leading-snug group-hover:text-indigo-600 transition-colors">
                  {item.hindi}
                </h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{item.name}</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
