import React from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin, Scale, FileText, AlertCircle } from 'lucide-react';
import { AGENCY_INFO } from '../data/categories';

export default function LegalModal({ isOpen, onClose, page = 'about' }) {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (page) {
      case 'about':
        return (
          <div className="space-y-4 font-hindi">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-red-600">🏛️</span> हमारे बारे में (About Aryan News Agency)
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>आर्यन न्यूज़ एजेंसी (Aryan News Agency)</strong> ब्यावर एवं राजस्थान का अग्रणी स्वतंत्र डिजिटल समाचार पोर्टल है। हमारा उद्देश्य स्थानीय नागरिकों तक निष्पक्ष, सटीक, निर्भीक और जनसरोकार से जुड़ी खबरें सबसे पहले पहुंचाना है।
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <p><strong>संपादक एवं निदेशक:</strong> {AGENCY_INFO.editor}</p>
              <p><strong>कार्यालय पता:</strong> {AGENCY_INFO.address}</p>
              <p><strong>ईमेल:</strong> <a href={`mailto:${AGENCY_INFO.email}`} className="text-red-600 underline">{AGENCY_INFO.email}</a></p>
              <p><strong>हेल्पलाइन / व्हाट्सएप:</strong> {AGENCY_INFO.phonePrimary}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              हम पत्रकारिता के उच्चतम मानकों, सत्यनिष्ठा और डिजिटल मीडिया आचार संहिता का पूर्ण पालन करते हैं।
            </p>
          </div>
        );

      case 'grievance':
        return (
          <div className="space-y-4 font-hindi">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-red-600" /> शिकायत निवारण तंत्र (Grievance Redressal)
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              सूचना प्रौद्योगिकी (मध्यवर्ती संसथान दिशानिर्देश एवं डिजिटल मीडिया आचार संहिता) नियम, 2021 के नियम 11 के तहत शिकायत निवारण अधिकारी का विवरण:
            </p>
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-2xl space-y-2 text-xs">
              <p><strong>शिकायत अधिकारी (Grievance Officer):</strong> हिमांशु अग्रवाल</p>
              <p><strong>पद:</strong> मुख्य संपादक / अधिकृत शिकायत निवारण अधिकारी</p>
              <p><strong>आधिकारिक ईमेल:</strong> <a href={`mailto:${AGENCY_INFO.email}`} className="text-red-600 font-bold underline font-mono">{AGENCY_INFO.email}</a></p>
              <p><strong>संपर्क नंबर:</strong> {AGENCY_INFO.phonePrimary}</p>
              <p><strong>डाक का पता:</strong> {AGENCY_INFO.address}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              किसी भी प्रकाशित समाचार, कॉपीराइट, तथ्यगत त्रुटि अथवा आपत्ति के संबंध में पाठक उपरोक्त ईमेल पर संपूर्ण विवरण व आपत्तिजनक लिंक सहित शिकायत भेज सकते हैं। हम नियमानुसार 24 घंटे में पावती एवं 15 कार्यदिवसों के भीतर समाधान सुनिश्चित करते हैं।
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4 font-hindi">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-red-600" /> गोपनीयता नीति (Privacy Policy)
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              आर्यन न्यूज़ एजेंसी (aryannewsagency.com) अपने पाठकों की गोपनीयता का पूरा सम्मान करती है।
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li><strong>डेटा संग्रह:</strong> हम केवल बेहतर उपयोगकर्ता अनुभव (जैसे डार्क मोड, बुकमार्क, भाषा प्राथमिकता) हेतु लोकल स्टोरेज का उपयोग करते हैं।</li>
              <li><strong>तृतीय पक्ष लिंक:</strong> हमारी वेबसाइट पर प्रकाशित बाहरी समाचार स्रोतों या विज्ञापनों के लिंक पर क्लिक करने पर संबंधित तृतीय पक्ष की गोपनीयता नीतियां लागू होंगी।</li>
              <li><strong>सुरक्षा:</strong> वेबसाइट पर प्रेषित किसी भी जानकारी को अत्याधुनिक एन्क्रिप्शन व क्लाउड सिक्योरिटी द्वारा सुरक्षित रखा जाता है।</li>
            </ul>
          </div>
        );

      case 'terms':
      default:
        return (
          <div className="space-y-4 font-hindi">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600" /> नियम एवं शर्तें (Terms of Service)
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              इस वेबसाइट (aryannewsagency.com) का उपयोग करने पर आप निम्नलिखित शर्तों से बाध्य होने की सहमति प्रदान करते हैं:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li><strong>कॉपीराइट:</strong> आर्यन न्यूज़ एजेंसी पर प्रकाशित स्थानीय रिपोर्ट्स व चित्रों के कॉपीराइट सुरक्षित हैं। बिना अनुमति पुनरुत्पादन वर्जित है।</li>
              <li><strong>बाहरी सामग्री:</strong> राष्ट्रीय व अंतरराष्ट्रीय समाचार विभिन्न अधिकृत स्रोतों के सौजन्य से प्रदर्शित किए जाते हैं जिनके मूल अधिकार संबंधित प्रकाशकों के पास हैं।</li>
              <li><strong>न्यायिक क्षेत्राधिकार:</strong> किसी भी विवाद की स्थिति में न्यायिक क्षेत्राधिकार केवल ब्यावर (राजस्थान) न्यायालय होगा।</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {renderContent()}

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-xl transition hover:opacity-90"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
