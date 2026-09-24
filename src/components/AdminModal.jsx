import React, { useState } from 'react';
import { 
  X, PlusCircle, Trash2, Edit3, Save, TrendingUp, 
  Flame, Image, FileText, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

import { supabase, isSupabaseConfigured } from '../services/supabase';

export default function AdminModal({
  isOpen,
  onClose,
  onAddArticle,
  onDeleteArticle,
  articles = [],
  mandiRates = [],
  onUpdateMandiRates,
  breakingNews = [],
  onUpdateBreakingNews
}) {
  const [activeTab, setActiveTab] = useState('new_article'); // 'new_article' | 'manage_articles' | 'mandi' | 'breaking'
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // New article form
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('beawar');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&auto=format&fit=crop&q=80');
  const [newAuthor, setNewAuthor] = useState('आर्यन ब्यूरो, ब्यावर');
  const [isHero, setIsHero] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mandi rates editable state
  const [editableMandi, setEditableMandi] = useState([...mandiRates]);

  // Breaking ticker editable state
  const [newTickerText, setNewTickerText] = useState('');

  if (!isOpen) return null;

  // Strict Supabase Auth Login - No bypass
  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase Auth is not configured. Please set environment variables.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        setIsPasscodeAuthenticated(true);
        setAuthError('');
      }
    } catch (err) {
      setAuthError(err.message || 'लॉगिन विफल! ईमेल या पासवर्ड की जांच करें।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const articleObj = {
      id: `custom-art-${Date.now()}`,
      titleHi: newTitle,
      titleEn: newTitle,
      summaryHi: newSummary || newTitle,
      summaryEn: newSummary || newTitle,
      contentHi: newContent || newSummary || newTitle,
      contentEn: newContent || newSummary || newTitle,
      category: newCategory,
      image: newImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
      publishedAt: new Date().toISOString(),
      author: newAuthor,
      isHero: isHero,
      isTrending: true,
      isBreaking: isBreaking,
      readTime: '2 मिनट'
    };

    onAddArticle(articleObj);
    setSuccessMessage('खबर सफलतापूर्वक पोर्टल पर प्रकाशित हो गई है!');
    setNewTitle('');
    setNewSummary('');
    setNewContent('');

    setTimeout(() => {
      setSuccessMessage('');
      setActiveTab('manage_articles');
    }, 1500);
  };

  const handleMandiChange = (index, field, value) => {
    const updated = [...editableMandi];
    updated[index] = { ...updated[index], [field]: value };
    setEditableMandi(updated);
  };

  const handleSaveMandi = () => {
    onUpdateMandiRates(editableMandi);
    alert('ब्यावर मंडी भाव अपडेट कर दिए गए हैं!');
  };

  const handleAddTicker = (e) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    const updated = [newTickerText.trim(), ...breakingNews];
    onUpdateBreakingNews(updated);
    setNewTickerText('');
  };

  const handleDeleteTicker = (index) => {
    const updated = breakingNews.filter((_, idx) => idx !== index);
    onUpdateBreakingNews(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 via-brand-700 to-red-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-hindi">
                आर्यन न्यूज़ एजेंसी - संपादकीय एडमिन पैनल (CMS)
              </h3>
              <p className="text-xs text-red-200">
                ब्यावर लोकल न्यूज़ प्रकाशन, मंडी भाव व ताज़ा अपडेट्स प्रबंधन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supabase Auth Login if not authenticated */}
        {!isPasscodeAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              🔒
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-hindi">
              संपादकीय सुरक्षा लॉगिन (Supabase Auth)
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              यह पैनल केवल आर्यन न्यूज़ एजेंसी के अधिकृत एडमिन के लिए है। कृपया अपना पंजीकृत ईमेल और पासवर्ड दर्ज करें।
            </p>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  एडमिन ईमेल (Email)
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@aryannewsagency.com"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  पासवर्ड (Password)
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-md transition disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? 'प्रमाणीकरण हो रहा...' : 'सुरक्षित लॉगिन करें'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Nav Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 overflow-x-auto no-scrollbar text-xs font-bold">
              <button
                onClick={() => setActiveTab('new_article')}
                className={`py-3 px-4 border-b-2 transition ${
                  activeTab === 'new_article'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                ➕ नई खबर प्रकाशित करें
              </button>
              <button
                onClick={() => setActiveTab('manage_articles')}
                className={`py-3 px-4 border-b-2 transition ${
                  activeTab === 'manage_articles'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                📑 सभी प्रकाशित खबरें ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('mandi')}
                className={`py-3 px-4 border-b-2 transition ${
                  activeTab === 'mandi'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                🌾 ब्यावर मंडी भाव अपडेट
              </button>
              <button
                onClick={() => setActiveTab('breaking')}
                className={`py-3 px-4 border-b-2 transition ${
                  activeTab === 'breaking'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                ⚡ ब्रेकिंग न्यूज़ टिकर ({breakingNews.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              
              {/* 1. NEW ARTICLE FORM */}
              {activeTab === 'new_article' && (
                <form onSubmit={handleCreateArticle} className="space-y-4 max-w-2xl mx-auto">
                  {successMessage && (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      खबर का शीर्षक (Headline) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="उदा. ब्यावर में नई सड़क निर्माण कार्य का शुभारंभ..."
                      className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm font-hindi text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        श्रेणी (Category)
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-xs font-hindi text-gray-900 dark:text-white"
                      >
                        {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nameHi}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        रिपोर्टर / ब्यूरो का नाम
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      फोटो लिंक (Image URL)
                    </label>
                    <input
                      type="url"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      संक्षिप्त विवरण (Summary / 60-Word Reader)
                    </label>
                    <textarea
                      rows={2}
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      placeholder="खबर का सार (1-2 वाक्य)..."
                      className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-xs font-hindi text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      विस्तृत समाचार (Full Story Text)
                    </label>
                    <textarea
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="पूरी खबर विस्तार से लिखें..."
                      className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-xs font-hindi text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-6 py-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={isHero}
                        onChange={(e) => setIsHero(e.target.checked)}
                        className="rounded text-red-600 w-4 h-4"
                      />
                      <span>मुख्य हेडलाइन (Hero Spotlight) बनाएं</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="rounded text-red-600 w-4 h-4"
                      />
                      <span>ब्रेकिंग न्यूज़ फ्लैश करें</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-md transition"
                  >
                    खबर प्रकाशित करें (Publish Now)
                  </button>
                </form>
              )}

              {/* 2. MANAGE ARTICLES LIST */}
              {activeTab === 'manage_articles' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 mb-2">
                    कुल प्रकाशित खबरें: {articles.length} | किसी भी खबर को हटाने के लिए 'डिलीट' पर क्लिक करें।
                  </div>
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between gap-3 border border-gray-100 dark:border-gray-700"
                    >
                      <img
                        src={art.image}
                        alt=""
                        className="w-14 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                          {art.titleHi}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                          <span className="text-red-600 font-semibold">{art.category}</span>
                          <span>•</span>
                          <span>{art.author}</span>
                          <span>•</span>
                          <span>{new Date(art.publishedAt).toLocaleDateString('hi-IN')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm('क्या आप सचमुच यह खबर हटाना चाहते हैं?')) {
                            onDeleteArticle(art.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. MANDI RATES UPDATE */}
              {activeTab === 'mandi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      ब्यावर कृषि उपज मंडी के आज के न्यूनतम व अधिकतम भाव संपादित करें:
                    </p>
                    <button
                      onClick={handleSaveMandi}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>भाव सहेजें (Save)</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editableMandi.map((row, idx) => (
                      <div
                        key={row.id}
                        className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs"
                      >
                        <div className="font-bold text-gray-900 dark:text-white font-hindi">
                          {row.cropHi}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">न्यूनतम:</span>
                          <input
                            type="number"
                            value={row.minPrice}
                            onChange={(e) => handleMandiChange(idx, 'minPrice', Number(e.target.value))}
                            className="w-24 px-2 py-1 border rounded dark:bg-gray-700 font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">अधिकतम:</span>
                          <input
                            type="number"
                            value={row.maxPrice}
                            onChange={(e) => handleMandiChange(idx, 'maxPrice', Number(e.target.value))}
                            className="w-24 px-2 py-1 border rounded dark:bg-gray-700 font-mono font-bold text-emerald-600"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">बदलाव:</span>
                          <input
                            type="text"
                            value={row.change}
                            onChange={(e) => handleMandiChange(idx, 'change', e.target.value)}
                            className="w-24 px-2 py-1 border rounded dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. BREAKING TICKER EDIT */}
              {activeTab === 'breaking' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddTicker} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newTickerText}
                      onChange={(e) => setNewTickerText(e.target.value)}
                      placeholder="नया ब्रेकिंग न्यूज़ अलर्ट जोड़ें..."
                      className="flex-1 px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-xs font-hindi text-gray-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0"
                    >
                      जोड़ें
                    </button>
                  </form>

                  <div className="space-y-2">
                    {breakingNews.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between text-xs gap-2"
                      >
                        <span className="font-hindi text-gray-800 dark:text-gray-200">
                          ⚡ {item}
                        </span>
                        <button
                          onClick={() => handleDeleteTicker(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}
