import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Mail, Phone, MapPin, Scale, 
  FileText, AlertCircle, Cookie, CheckCircle2, 
  Globe, Info, Award, UserCheck, ShieldAlert 
} from 'lucide-react';
import { AGENCY_INFO } from '../data/categories';

export default function LegalModal({ isOpen, onClose, page = 'about' }) {
  const [activeTab, setActiveTab] = useState(page);
  const [cookieStatus, setCookieStatus] = useState('accepted');

  useEffect(() => {
    setActiveTab(page);
  }, [page]);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('ana_cookie_consent') || 'accepted';
      setCookieStatus(consent);
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateCookie = (newStatus) => {
    try {
      localStorage.setItem('ana_cookie_consent', newStatus);
      localStorage.setItem('ana_cookie_date', new Date().toISOString());
      setCookieStatus(newStatus);
    } catch (e) {}
  };

  const tabs = [
    { id: 'about', labelHi: 'हमारे बारे में', icon: Info },
    { id: 'terms', labelHi: 'नियम एवं शर्तें', icon: FileText },
    { id: 'privacy', labelHi: 'गोपनीयता नीति', icon: ShieldCheck },
    { id: 'cookies', labelHi: 'कुकी नीति', icon: Cookie },
    { id: 'grievance', labelHi: 'शिकायत निवारण', icon: Scale },
    { id: 'editorial', labelHi: 'संपादकीय नीति', icon: Award }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-hindi">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              आ
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">
                आर्यन न्यूज़ एजेंसी • वैधानिक एवं नीति केंद्र
              </h3>
              <p className="text-[11px] text-gray-500">
                Aryan News Agency • Legal, Compliance & Editorial Policies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 sm:px-8 py-2.5 bg-gray-100/70 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.labelHi}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          
          {/* TAB 1: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  परिचय एवं मिशन (About Us)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  आर्यन न्यूज़ एजेंसी (Aryan News Agency)
                </h2>
              </div>

              <p>
                <strong>आर्यन न्यूज़ एजेंसी</strong> ब्यावर (राजस्थान) का प्रमुख स्वतंत्र एवं निष्पक्ष डिजिटल समाचार संगठन है। 1940 के दशक से समाचार वितरण एवं पत्रकारिता के समृद्ध इतिहास के साथ, हमारा डिजिटल मंच ब्यावर, अजमेर, पाली, राजसमंद एवं संपूर्ण राजस्थान के जनसरोकार, विकास, संस्कृति और समसामयिक विषयों को प्राथमिकता से प्रस्तुत करता है।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <h4 className="font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-red-600" />
                    संपादकीय नेतृत्व
                  </h4>
                  <p className="text-xs"><strong>मुख्य संपादक:</strong> {AGENCY_INFO.editor}</p>
                  <p className="text-xs"><strong>स्वामित्व:</strong> आर्यन न्यूज़ एजेंसी (पंजीकृत व्यापार)</p>
                  <p className="text-xs"><strong>मुख्यालय:</strong> ब्यावर, राजस्थान (305901)</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <h4 className="font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    डिजिटल पहुंच व तकनीक
                  </h4>
                  <p className="text-xs"><strong>आधिकारिक वेबसाइट:</strong> <a href="https://www.aryannewsagency.com" target="_blank" rel="noreferrer" className="text-red-600 underline">aryannewsagency.com</a></p>
                  <p className="text-xs"><strong>सुविधाएं:</strong> एआई टेक्स्ट-टू-स्पीच, 60-शब्द त्वरित पाठ, 24x7 ब्रेकिंग फ्लैश</p>
                  <p className="text-xs"><strong>संपर्क हेल्पलाइन:</strong> {AGENCY_INFO.phonePrimary}</p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm mb-1">
                  हमारा संपादकीय संकल्प:
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  हम किसी भी राजनीतिक दल, व्यावसायिक दबाव या वैचारिक पूर्वाग्रह से मुक्त होकर केवल सत्य, तथ्य और जनहित के पक्ष में पत्रकारिता करने के लिए प्रतिबद्ध हैं।
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  उपयोग की शर्तें (Terms of Service)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  नियम एवं शर्तें
                </h2>
                <p className="text-xs text-gray-500 mt-1">अंतिम अद्यतन: 2026</p>
              </div>

              <p className="text-xs sm:text-sm">
                इस वेबसाइट (<strong>aryannewsagency.com</strong>) का उपयोग करने से पूर्व कृपया इन नियमों एवं शर्तों को ध्यानपूर्वक पढ़ें। वेबसाइट का उपयोग करने पर आप इन शर्तों से पूर्णतः सहमत माने जाएंगे।
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">1. बौद्धिक संपदा अधिकार एवं स्थानीय सामग्री</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    आर्यन न्यूज़ एजेंसी द्वारा सृजित स्थानीय समाचार, विश्लेषण, ग्राउंड रिपोर्ट्स, फोटो व वीडियो आर्यन न्यूज़ एजेंसी की विशेष बौद्धिक संपदा हैं। किसी भी व्यक्ति या संस्था द्वारा बिना पूर्व लिखित अनुमति के व्यावसायिक पुनरुत्पादन या अनधिकृत कॉपी करना कॉपीराइट उल्लंघन माना जाएगा।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">2. तृतीय पक्ष स्रोत</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    अन्य प्रकाशकों की खबरों के केवल शीर्षक व संक्षिप्त अंश मूल स्रोत के लिंक के साथ दिखाए जाते हैं; सभी अधिकार मूल प्रकाशकों के हैं।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">3. नागरिक पत्रकारिता एवं उपयोगकर्ता द्वारा प्रेषित सामग्री</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    व्हाट्सएप या पोर्टल के माध्यम से अपनी खबर/फोटो/वीडियो प्रेषित करते समय प्रेषक प्रमाणित करता है कि सामग्री प्रामाणिक है तथा वह किसी कॉपीराइट, मानहानि या कानून का उल्लंघन नहीं करती। आर्यन न्यूज़ एजेंसी सामग्री के संपादन, सत्यापन अथवा अस्वीकरण का पूर्ण अधिकार रखती है।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">4. विज्ञापन एवं प्रायोजित सामग्री</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    पोर्टल पर प्रदर्शित विज्ञापनों में किए गए दावों, उत्पादों अथवा सेवाओं की शुद्धता व गुणवत्ता के लिए संबंधित विज्ञापनदाता पूर्णतः उत्तरदायी हैं।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">5. न्यायिक क्षेत्राधिकार (Jurisdiction)</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    इस वेबसाइट के उपयोग अथवा किसी भी प्रकार के विवाद की स्थिति में न्यायिक क्षेत्राधिकार केवल <strong>ब्यावर न्यायालय (जिला ब्यावर, राजस्थान, भारत)</strong> होगा।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  डेटा सुरक्षा नीति (Privacy Policy)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  गोपनीयता नीति
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP) एवं आईटी नियमों के अनुरूप
                </p>
              </div>

              <p className="text-xs sm:text-sm">
                आर्यन न्यूज़ एजेंसी अपने पाठकों की डिजिटल गोपनीयता का सर्वोच्च सम्मान करती है। यह नीति स्पष्ट करती है कि हम आपकी जानकारी का संग्रह और उपयोग किस प्रकार करते हैं।
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    1. हम कौन सा डेटा संग्रहीत करते हैं?
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    <li><strong>उपयोगकर्ता प्राथमिकताएं:</strong> डार्क मोड, फॉन्ट साइज, ऑडियो भाषा व बुकमार्क (यह डेटा आपके ही ब्राउज़र के LocalStorage में रहता है)।</li>
                    <li><strong>तकनीकी लॉग्स:</strong> ब्राउज़र प्रकार, डिवाइस श्रेणी (मोबाइल/डेस्कटॉप), विज़िट समय (सर्वर सुरक्षा एवं प्रदर्शन हेतु)।</li>
                    <li><strong>स्वैच्छिक डेटा:</strong> नागरिक पत्रकारिता के तहत जब आप खबर भेजते हैं तो आपका नाम और व्हाट्सएप नंबर।</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">2. डेटा का उपयोग एवं बिक्री निषेध</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    हम अपने पाठकों का व्यक्तिगत डेटा किसी भी तीसरे पक्ष, विपणन एजेंसी या डेटा ब्रोकर को कभी नहीं बेचते और न ही साझा करते हैं।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">3. तृतीय-पक्ष लिंक एवं सेवाएं</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    हमारी वेबसाइट पर मूल प्रकाशकों (जैसे दैनिक भास्कर, बीबीसी आदि) के लिंक तथा गूगल मैप्स उपलब्ध हैं। उन लिंक्स पर क्लिक करने के पश्चात संबंधित वेबसाइट की अपनी गोपनीयता नीतियां प्रभावी होंगी।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">4. डेटा सुरक्षा उपाय</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    हमारी वेबसाइट SSL/TLS 256-बिट एन्क्रिप्शन से सुरक्षित है जिससे आपका कनेक्शन पूर्णतः सुरक्षित और संरक्षित रहता है।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-5">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  कुकी प्रबंधन (Cookie Policy & Preferences)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  कुकी एवं लोकल स्टोरेज नीति
                </h2>
              </div>

              <p className="text-xs sm:text-sm">
                कुकीज़ एवं ब्राउज़र स्टोरेज छोटी फ़ाइलें होती हैं जो वेबसाइट को आपकी प्राथमिकताओं को याद रखने में सक्षम बनाती हैं।
              </p>

              {/* Interactive Cookie Preference Box */}
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-4 sm:p-5 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-gray-950 dark:text-white text-sm">
                      आपकी वर्तमान कुकी सहमति स्थिति
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      स्थिति: <strong className="text-red-600 font-sans">{cookieStatus === 'accepted' ? 'सभी कुकीज़ स्वीकृत (Accepted All)' : 'केवल आवश्यक कुकीज़ (Essential Only)'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateCookie('essential_only')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        cookieStatus === 'essential_only'
                          ? 'bg-gray-800 text-white shadow'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      केवल आवश्यक
                    </button>
                    <button
                      onClick={() => handleUpdateCookie('accepted')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        cookieStatus === 'accepted'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      सभी स्वीकार करें
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="font-bold text-gray-950 dark:text-white">हम किन कुकीज़ का उपयोग करते हैं?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-emerald-600 block mb-1">✓ आवश्यक स्टोरेज (Essential)</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">डार्क/लाइट थीम, पसंदीदा भाषा और सहेजे गए बुकमार्क को सुरक्षित रखने हेतु।</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-blue-600 block mb-1">✓ ऑडियो व मीडिया प्राथमिकताएं</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">टेक्स्ट-टू-स्पीच और वीडियो प्लेयर की म्यूट/वॉल्यूम सेटिंग्स याद रखने हेतु।</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GRIEVANCE REDRESSAL (IT RULES 2021) */}
          {activeTab === 'grievance' && (
            <div className="space-y-5">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  वैधानिक शिकायत तंत्र (Grievance Redressal Mechanism)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  शिकायत निवारण अधिकारी
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश एवं डिजिटल मीडिया आचार संहिता) नियम, 2021 के नियम 11 के अंतर्गत
                </p>
              </div>

              <p className="text-xs sm:text-sm">
                आर्यन न्यूज़ एजेंसी द्वारा प्रकाशित किसी भी समाचार, तथ्यगत अशुद्धि, कॉपीराइट या डिजिटल मीडिया आचार संहिता से संबंधित किसी भी शिकायत हेतु पाठक हमारे अधिकृत शिकायत निवारण अधिकारी से सीधे संपर्क कर सकते हैं।
              </p>

              {/* Officer Details Card */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-red-950/30 border-2 border-red-200 dark:border-red-900/60 p-5 rounded-3xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-600 text-white">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-950 dark:text-white text-base">
                      शिकायत निवारण अधिकारी का विवरण:
                    </h3>
                    <p className="text-xs text-gray-500">Grievance Redressal Officer</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">नाम ও पदनाम:</span>
                    <strong className="text-gray-900 dark:text-white font-bold text-sm">हिमांशु अग्रवाल (मुख्य संपादक / अधिकृत अधिकारी)</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">ईमेल (त्वरित निवारण):</span>
                    <a href={`mailto:${AGENCY_INFO.email}`} className="text-red-600 font-bold underline font-sans text-sm">
                      {AGENCY_INFO.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500 block">हेल्पलाइन संपर्क:</span>
                    <strong className="text-gray-900 dark:text-white font-sans">{AGENCY_INFO.phonePrimary}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">कार्यालय व पत्राचार का पता:</span>
                    <span className="text-gray-900 dark:text-white">{AGENCY_INFO.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
                <h4 className="font-bold text-gray-950 dark:text-white">शिकायत दर्ज करने की प्रक्रिया व समय-सीमा:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-gray-600 dark:text-gray-300">
                  <li>शिकायतकर्ता ईमेल के विषय में <strong>'समाचार आपत्ति / Grievance Redressal'</strong> अवश्य लिखें।</li>
                  <li>संबंधित खबर का वेब लिंक (URL), प्रकाशन तिथि तथा आपत्ति का विस्तृत कारण संलग्न करें।</li>
                  <li>नियम 11(2)(a) के अनुसार हमारी टीम <strong>24 घंटे के भीतर</strong> शिकायत की पावती (Acknowledgement) प्रेषित करेगी।</li>
                  <li>नियम 11(2)(b) के अनुसार <strong>15 कार्यदिवसों के भीतर</strong> जांच पूर्ण कर उचित संशोधन, स्पष्टीकरण अथवा समाधान सूचित किया जाएगा।</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 6: EDITORIAL & FACT-CHECKING */}
          {activeTab === 'editorial' && (
            <div className="space-y-5">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  संपादकीय मानक (Editorial & Fact-Checking Policy)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  तथ्य-जांच व निष्पक्षता नीति
                </h2>
              </div>

              <p className="text-xs sm:text-sm">
                आर्यन न्यूज़ एजेंसी का मूल सिद्धांत है: <strong>"सत्य, निष्पक्षता एवं जनसरोकार"</strong>। हम भ्रामक सूचनाओं (Fake News) तथा सनसनीखेज पत्रकारिता का पुरजोर विरोध करते हैं।
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">1. बहु-स्तरीय तथ्य सत्यापन (Fact Verification)</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    ब्यावर व स्थानीय क्षेत्र की प्रत्येक ग्राउंड रिपोर्ट को प्रकाशित करने से पूर्व संबंधित प्रशासनिक अधिकारियों, प्रत्यक्षदर्शियों अथवा आधिकारिक दस्तावेजों से सत्यापित किया जाता है।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">2. संशोधन एवं त्रुटि सुधार नीति (Corrections Policy)</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    यदि किसी रिपोर्ट में अनजाने में कोई तथ्यात्मक त्रुटि पाई जाती है, तो हम तत्काल उसे संशोधित करते हैं और पारदर्शिता हेतु सुधार नोट प्रदर्शित करते हैं।
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white mb-1">3. निष्पक्षता व संतुलन</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    विवादास्पद मामलों में सभी संबंधित पक्षों का दृष्टिकोण निष्पक्ष रूप से प्रस्तुत करने का पूरा प्रयास किया जाता है।
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-8 py-3.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>आर्यन न्यूज़ एजेंसी • ब्यावर (राज.) • अधिकृत डिजिटल पोर्टल</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl shadow transition"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
