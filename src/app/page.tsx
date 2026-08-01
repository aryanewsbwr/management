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
  ChevronRight,
  Sparkles
} from 'lucide-react';

const primaryEnglishMenuItems = [
  { num: '1', primary: '1. Publisher Info', secondary: 'प्रकाशक जानकारी', desc: 'Add or view newspaper publishers & press info', href: '/publishers', icon: Building, color: 'bg-blue-600' },
  { num: '2', primary: '2. Publication Info', secondary: 'अखबार एवं दर जानकारी', desc: 'Newspaper titles & weekly rate matrix', href: '/publications', icon: Newspaper, color: 'bg-indigo-600' },
  { num: '3', primary: '3. Region Details', secondary: 'क्षेत्र / जोन विवरण', desc: 'City areas & distribution zones', href: '/regions', icon: MapPin, color: 'bg-purple-600' },
  { num: '4', primary: '4. Hawker Details', secondary: 'हॉकर विवरण (वितरण)', desc: 'Hawker delivery boys & route assignments', href: '/hawkers', icon: Truck, color: 'bg-sky-600' },
  { num: '5', primary: '5. Customer Info', secondary: 'ग्राहक जानकारी एवं पेपर', desc: 'Add customers, addresses & subscriptions', href: '/customers', icon: Users, color: 'bg-emerald-600' },
  { num: '6', primary: '6. Rate Changes Info', secondary: 'दर बदलाव लॉग (रेट)', desc: 'Weekday rate change logs & history', href: '/ratechanges', icon: DollarSign, color: 'bg-amber-600' },
  { num: '7', primary: '7. Define Holiday', secondary: 'छुट्टी / त्यौहार अवकाश', desc: 'Festival holidays & press break dates', href: '/holidays', icon: Calendar, color: 'bg-orange-600' },
  { num: '8', primary: '8. Purchase Invoice', secondary: 'अखबार खरीद इनवॉइस', desc: 'Wholesale publisher stock purchase entries', href: '/purchases', icon: ShoppingBag, color: 'bg-rose-600' },
  { num: '9', primary: '9. Retail Sale', secondary: 'काउंटर नकद बिक्री', desc: 'Direct OTC newspaper cash sales', href: '/countersales', icon: Receipt, color: 'bg-teal-600' },
  { num: '10', primary: '10. Discontinue Info', secondary: 'ग्राहक वैकेशन (छुट्टी स्टॉप)', desc: 'Temporary vacation hold or permanent stops', href: '/discontinue', icon: PauseCircle, color: 'bg-yellow-600' },
  { num: '11', primary: '11. Press Suspensions', secondary: 'बंद अखबार सस्पेंशन', desc: 'Non-printing press suspension logs', href: '/presssuspensions', icon: Scissors, color: 'bg-fuchsia-600' },
  { num: '12', primary: '12. Receipt Allotment', secondary: 'रसीद बुक आवंटन', desc: 'Receipt book ranges issued to collectors', href: '/receiptallotment', icon: BookOpen, color: 'bg-cyan-600' },
  { num: '13', primary: '13. Payment Receipt', secondary: 'भुगतान रसीद प्रविष्टि', desc: 'Customer bill payment entry (Cash/Cheque)', href: '/receipts', icon: CreditCard, color: 'bg-emerald-700' },
  { num: '14', primary: '14. Bill Processing', secondary: 'महीने का बिल जनरेट करें', desc: 'Calculate & generate monthly bills by region', href: '/billing', icon: FileText, color: 'bg-blue-700' },
  { num: '15', primary: '15. Reports & Printing', secondary: 'प्रिंट व रिपोर्ट', desc: 'Print monthly bills, address stickers & hawker sheets', href: '/reports?tab=hawker_sheet', icon: Printer, color: 'bg-slate-800' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30 uppercase tracking-wider">
            Aryan News Agency • Main Software Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">Main Menu Overview</h1>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Select any module below to launch its dedicated form window (Click or Hover Top Navigation)
          </p>
        </div>
      </div>

      {/* Main Menu Grid with English Primary + Hindi Secondary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {primaryEnglishMenuItems.map((item) => {
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
                {/* Primary English Title */}
                <h2 className="text-base font-black text-slate-900 mt-1 leading-snug group-hover:text-indigo-600 transition-colors">
                  {item.primary}
                </h2>
                {/* Secondary Hindi Subtitle */}
                <p className="text-xs font-bold text-slate-500 mt-0.5">({item.secondary})</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
