import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Key, Eye, EyeOff, ShieldCheck, CheckCircle2, 
  AlertCircle, Upload, Image as ImageIcon, Trash2, ExternalLink, 
  LogOut, PlusCircle, ArrowLeft, RefreshCw, Sparkles, TrendingUp, Save,
  Edit3
} from 'lucide-react';
import { AGENCY_INFO } from '../data/categories';
import { StorageService } from '../services/storage';
import { compressImage } from '../utils/imageCompressor';

import { supabase, isSupabaseConfigured } from '../services/supabase';

export default function AdminPanel({ onNavigateHome, onNewsUpdated }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Dashboard Active Tab: 'upload' | 'manage' | 'mandi' | 'breaking'
  const [activeTab, setActiveTab] = useState('upload');

  // Form State for Non-Tech Upload & Edit
  const [editingArticle, setEditingArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('संवाददाता, ब्यावर');
  const [area, setArea] = useState('चांग गेट, ब्यावर');
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Uploaded Beawar articles list
  const [beawarArticles, setBeawarArticles] = useState([]);

  // Mandi & Breaking States
  const [breakingNews, setBreakingNews] = useState([]);
  const [newTicker, setNewTicker] = useState('');

  // Check existing Supabase auth session
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
          setCurrentUserEmail(session.user?.email || '');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(Boolean(session));
        if (session) {
          setCurrentUserEmail(session.user?.email || '');
          loadData();
        } else {
          setCurrentUserEmail('');
        }
      });

      loadData();
      return () => subscription.unsubscribe();
    } else {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const customArticles = await StorageService.fetchCustomArticles();
      setBeawarArticles(customArticles.filter(a => a.category === 'beawar'));

      const bn = await StorageService.fetchBreakingNews();
      setBreakingNews(bn || []);
    } catch (e) {
      console.error('[AdminPanel] Error loading data:', e);
    }
  };

  // Handle Login via Supabase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase Auth कॉन्फ़िगर नहीं है। कृपया Vercel पर्यावरण चर (VITE_SUPABASE_URL और VITE_SUPABASE_ANON_KEY) जोड़ें।');
      }

      let emailToAuth = adminEmail.trim();
      if (!emailToAuth.includes('@')) {
        emailToAuth = `${emailToAuth}@aryannewsagency.com`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: adminPassword
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        setIsAuthenticated(true);
        setCurrentUserEmail(data.session.user?.email || adminEmail);
        setLoginError('');
        await loadData();
      }
    } catch (err) {
      setLoginError(err.message || 'लॉगिन विफल! ईमेल या पासवर्ड की जांच करें।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUserEmail('');
  };

  // Start Editing an existing Beawar article
  const handleStartEdit = (article) => {
    setEditingArticle(article);
    setTitle(article.titleHi || '');
    setContent(article.contentHi || '');

    const rawAuthor = article.author || 'संवाददाता, ब्यावर';
    const match = rawAuthor.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    if (match && match[2]) {
      setAuthor(match[1].trim());
      setArea(match[2].trim());
    } else {
      setAuthor(rawAuthor);
      setArea('चांग गेट, ब्यावर');
    }

    setImagePreview(article.image || '');
    setSelectedFile(null);
    setCompressedDataUrl('');
    setUploadSuccess('');
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setTitle('');
    setContent('');
    setAuthor('संवाददाता, ब्यावर');
    setArea('चांग गेट, ब्यावर');
    setImagePreview('');
    setSelectedFile(null);
    setCompressedDataUrl('');
    setUploadSuccess('');
  };

  // Auto check URL query param ?edit=<id>
  useEffect(() => {
    if (beawarArticles.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('edit');
      if (editId) {
        const found = beawarArticles.find(a => a.id === editId);
        if (found) {
          handleStartEdit(found);
        }
      }
    }
  }, [beawarArticles]);

  // Image File Picker with Client-Side Canvas Compression
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('फोटो का साइज 15MB से कम होना चाहिए।');
      return;
    }

    setIsCompressingImage(true);
    try {
      // High-quality client-side compression (~50KB-90KB)
      const { dataUrl, blob } = await compressImage(file);
      setSelectedFile(blob);
      setCompressedDataUrl(dataUrl);
      setImagePreview(dataUrl);
    } catch (err) {
      console.warn('Canvas compression fallback to raw file:', err);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCompressedDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Handle Beawar News Publish or Update with Supabase Storage + DataURL Fallback
  const handlePublishNews = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('कृपया खबर का शीर्षक और विवरण दोनों भरें।');
      return;
    }

    setIsSubmitting(true);
    setUploadSuccess('');

    try {
      // Start with current image in preview (or existing image if editing)
      let finalImageUrl = imagePreview || '';

      // If user selected a new file/blob, attempt Supabase Storage upload
      if (selectedFile) {
        try {
          finalImageUrl = await StorageService.uploadArticleImage(selectedFile);
        } catch (uploadErr) {
          console.warn('[Storage] Storage bucket upload failed, using high-quality compressed image data URL:', uploadErr.message);
          // 100% RELIABLE FAILSAFE: Use compressed Data URL directly!
          // NEVER fall back to Unsplash placeholder when user uploaded an image!
          finalImageUrl = compressedDataUrl || imagePreview;
        }
      }

      // If still empty (user never uploaded photo and no existing image)
      if (!finalImageUrl) {
        finalImageUrl = 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&auto=format&fit=crop&q=80';
      }

      const formattedAuthor = area.trim() ? `${author.trim()} (${area.trim()})` : author.trim();

      const articlePayload = {
        id: editingArticle ? editingArticle.id : `custom-bwr-${Date.now()}`,
        titleHi: title.trim(),
        titleEn: title.trim(),
        summaryHi: content.trim().slice(0, 160) + (content.length > 160 ? '...' : ''),
        summaryEn: content.trim().slice(0, 160) + (content.length > 160 ? '...' : ''),
        contentHi: content.trim(),
        contentEn: content.trim(),
        category: 'beawar',
        image: finalImageUrl,
        publishedAt: editingArticle ? editingArticle.publishedAt : new Date().toISOString(),
        author: formattedAuthor || 'संवाददाता, ब्यावर',
        isHero: false,
        isTrending: true,
        isBreaking: false,
        readTime: '2 मिनट'
      };

      await StorageService.saveArticle(articlePayload);

      const successMsg = editingArticle 
        ? 'ब्यावर की खबर सफलतापूर्वक अपडेट (संपादित) कर दी गई है!' 
        : 'ब्यावर की खबर सफलतापूर्वक डेटाबेस में सुरक्षित एवं प्रकाशित हो गई है!';

      setUploadSuccess(successMsg);
      handleCancelEdit();
      setIsSubmitting(false);

      await loadData();
      if (onNewsUpdated) onNewsUpdated();

      setTimeout(() => {
        setUploadSuccess('');
        setActiveTab('manage');
      }, 1500);
    } catch (err) {
      alert(`खबर प्रकाशित/अपडेट करने में त्रुटि: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  // Handle Delete Article
  const handleDeleteArticle = async (id) => {
    if (confirm('क्या आप सचमुच यह खबर वेबसाइट से हटाना चाहते हैं?')) {
      try {
        await StorageService.deleteArticle(id);
        await loadData();
        if (onNewsUpdated) onNewsUpdated();
      } catch (err) {
        alert(`हटाने में त्रुटि: ${err.message}`);
      }
    }
  };

  // Add Breaking Ticker
  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    const updated = [newTicker.trim(), ...breakingNews];
    try {
      await StorageService.saveBreakingNews(updated);
      setBreakingNews(updated);
      setNewTicker('');
      if (onNewsUpdated) onNewsUpdated();
    } catch (err) {
      alert(`ब्रेकिंग न्यूज़ सहेजने में त्रुटि: ${err.message}`);
    }
  };

  const handleDeleteTicker = async (idx) => {
    const updated = breakingNews.filter((_, i) => i !== idx);
    try {
      await StorageService.saveBreakingNews(updated);
      setBreakingNews(updated);
      if (onNewsUpdated) onNewsUpdated();
    } catch (err) {
      alert(`हटाने में त्रुटि: ${err.message}`);
    }
  };

  // ==========================================
  // 1. LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black text-gray-100 flex flex-col justify-center items-center p-4">
        
        {/* Top Back Link */}
        <button
          onClick={onNavigateHome}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य वेबसाइट पर जाएं</span>
        </button>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
          
          {/* Logo Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white p-1.5 flex items-center justify-center mx-auto mb-3 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <img src="/logo.png" alt="Aryan News Agency Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-black font-hindi">
              {AGENCY_INFO.nameHi}
            </h2>
            <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mt-0.5">
              संपादकीय एडमिन पैनल • ब्यावर
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ब्यावर लोकल न्यूज़ अपलोड एवं प्रबंधन पोर्टल
            </p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                यूजर आईडी या ईमेल (Username / Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="यूजर आईडी या ईमेल दर्ज करें"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="सुरक्षित पासवर्ड दर्ज करें"
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900 dark:text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-red-600 to-brand-700 hover:from-red-700 hover:to-brand-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/30 transition transform active:scale-95 text-sm font-hindi mt-2 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>सत्यापन हो रहा है...</span>
                </>
              ) : (
                <span>डैशबोर्ड में लॉगिन करें (Login)</span>
              )}
            </button>
          </form>

        </div>

        <p className="mt-6 text-xs text-gray-500">
          © Aryan News Agency • Netaji Subhash Marg, Beawar (Raj.)
        </p>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      
      {/* TOP DASHBOARD NAVBAR */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
              <img src="/logo.png" alt="Aryan News Agency Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white leading-tight">
                  आर्यन न्यूज़ एजेंसी • संपादकीय कंट्रोल पैनल
                </h1>
                <span className="hidden sm:inline bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  सक्रिय (Active)
                </span>
              </div>
              <p className="text-xs text-gray-500">
                लॉगिन: <strong className="font-mono text-gray-700 dark:text-gray-300">{currentUserEmail || 'व्यवस्थापक'}</strong> (ब्यावर डेस्क)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">वेबसाइट देखें</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition border border-red-200 dark:border-red-900"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>

        </div>
      </header>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2 text-xs sm:text-sm font-bold">
          
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'upload'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {editingArticle ? (
              <>
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>✏️ खबर संपादन मोड (Edit)</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>📝 ब्यावर खबर अपलोड करें</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'manage'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span>📋 अपलोड की गई खबरें ({beawarArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('breaking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'breaking'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span>⚡ ब्रेकिंग न्यूज़ टिकर</span>
          </button>

        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 flex-1">
        
        {/* ==================================================== */}
        {/* 1. SIMPLE NON-TECH BEAWAR NEWS UPLOADER FORM */}
        {/* ==================================================== */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            
            <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                {editingArticle ? 'संपादन मोड (Edit Article Mode)' : 'सरल एवं आसान अपलोडर (Simple News Publisher)'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-hindi text-gray-900 dark:text-white mt-1">
                {editingArticle ? 'प्रकाशित खबर में बदलाव / संपादन करें' : 'ब्यावर की नई खबर वेबसाइट पर जोड़ें'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {editingArticle 
                  ? 'शीर्षक, फोटो या विवरण में बदलाव करें और नीचे "खबर अपडेट करें" दबाएं।'
                  : 'नीचे खबर का शीर्षक, फोटो और पूरी जानकारी भरें। \'प्रकाशित करें\' दबाते ही खबर तुरंत वेबसाइट के "ब्यावर विशेष" व "मिक्स" में दिखने लगेगी।'
                }
              </p>
            </div>

            {/* Editing Active Notification Banner */}
            {editingArticle && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-300 dark:border-amber-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black font-hindi text-amber-900 dark:text-amber-200">
                      आप प्रकाशित खबर का संपादन (Edit) कर रहे हैं
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      आईडी: <span className="font-mono">{editingArticle.id}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="self-end sm:self-center px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>✕ संपादन रद्द करें (Cancel)</span>
                </button>
              </div>
            )}

            {uploadSuccess && (
              <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-2xl text-sm font-bold flex items-center gap-2 border border-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePublishNews} className="space-y-5">
              
              {/* 1. Title */}
              <div>
                <label className="block text-sm font-black font-hindi text-gray-800 dark:text-gray-200 mb-1.5">
                  1. खबर का मुख्य शीर्षक (Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. ब्यावर में चांग गेट पर नए हेरिटेज कार्य का शुभारंभ..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-base font-hindi focus:border-red-500 focus:bg-white dark:focus:bg-gray-850 focus:outline-none text-gray-900 dark:text-white font-bold"
                />
              </div>

              {/* 2. Photo Upload (Very simple for mobile/PC) */}
              <div>
                <label className="block text-sm font-black font-hindi text-gray-800 dark:text-gray-200 mb-1.5">
                  2. खबर की फोटो (Select Photo from Phone / PC)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  {/* File Upload Button */}
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-300 dark:border-red-900/60 rounded-2xl bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/50 cursor-pointer transition text-center">
                    <Upload className="w-8 h-8 text-red-600 mb-2" />
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      मोबाइल गैलरी / कंप्यूटर से फोटो चुनें
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5">
                      (JPG, PNG समर्थित)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Photo Preview Box */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    {isCompressingImage ? (
                      <div className="text-center p-4">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-red-600 animate-spin" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block font-hindi">
                          फोटो को ऑप्टिमाइज़ किया जा रहा है...
                        </span>
                      </div>
                    ) : imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setSelectedFile(null);
                            setCompressedDataUrl('');
                          }}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs shadow"
                          title="फोटो हटाएं"
                        >
                          ✕
                        </button>
                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-hindi">
                          {selectedFile ? 'नई फोटो चुनी गई' : 'मौजूदा फोटो'}
                        </span>
                      </>
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-xs font-medium block">फोटो प्रीव्यू यहाँ दिखेगा</span>
                        <span className="text-[10px] text-gray-400">(अगर फोटो नहीं चुनेंगे तो ब्यावर की मानक फोटो लग जाएगी)</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* 3. Full Story Description */}
              <div>
                <label className="block text-sm font-black font-hindi text-gray-800 dark:text-gray-200 mb-1.5">
                  3. खबर का पूरा विवरण (Full News Content) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="खबर की पूरी जानकारी यहाँ लिखें (क्या, कब, कहाँ, किसने कहा)..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-hindi leading-relaxed focus:border-red-500 focus:bg-white dark:focus:bg-gray-850 focus:outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* 4. Reporter Name & Area in Beawar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    4. संवाददाता / ब्यूरो का नाम
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="उदा. संवाददाता, ब्यावर"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-hindi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    5. क्षेत्र / वार्ड (Area in Beawar)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="उदा. चांग गेट, मेवाड़ी गेट, सेंदड़ा रोड"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-hindi"
                  />
                </div>
              </div>

              {/* Big Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {editingArticle && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-1/3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-4 rounded-2xl text-base font-hindi transition"
                  >
                    रद्द करें (Cancel)
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressingImage}
                  className={`flex-1 ${
                    editingArticle
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/30'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30'
                  } text-white font-black py-4 rounded-2xl text-base sm:text-lg font-hindi shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {editingArticle ? (
                    <>
                      <Save className="w-5 h-5 text-white" />
                      <span>{isSubmitting ? 'अपडेट हो रहा है...' : 'ब्यावर की खबर अपडेट करें (Update Now)'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>{isSubmitting ? 'प्रकाशित हो रहा है...' : 'ब्यावर की खबर तुरंत प्रकाशित करें (Publish Now)'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ==================================================== */}
        {/* 2. MANAGE UPLOADED BEAWAR NEWS */}
        {/* ==================================================== */}
        {activeTab === 'manage' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                  ब्यावर की प्रकाशित खबरें ({beawarArticles.length})
                </h3>
                <p className="text-xs text-gray-500">
                  एडमिन द्वारा अपलोड की गई खबरें नीचे सूचीबद्ध हैं।
                </p>
              </div>

              <button
                onClick={() => {
                  handleCancelEdit();
                  setActiveTab('upload');
                }}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>नई खबर जोड़ें</span>
              </button>
            </div>

            {beawarArticles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-xl">
                  📍
                </div>
                <h4 className="text-base font-bold font-hindi text-gray-800 dark:text-gray-200">
                  अभी तक कोई ब्यावर खबर अपलोड नहीं की गई है
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                  वेबसाइट के ब्यावर सेक्शन में फिलहाल "अभी कोई खबर उपलब्ध नहीं है" का संदेश दिख रहा है। पहली खबर जोड़ने के लिए नीचे क्लिक करें।
                </p>
                <button
                  onClick={() => {
                    handleCancelEdit();
                    setActiveTab('upload');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow"
                >
                  ➕ पहली खबर अभी अपलोड करें
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {beawarArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-300 dark:hover:border-gray-600 transition"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <img
                        src={art.image}
                        alt=""
                        className="w-20 h-16 object-cover rounded-xl shrink-0 border"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold font-hindi text-gray-900 dark:text-white line-clamp-2">
                          {art.titleHi}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1 flex-wrap">
                          <span className="font-semibold text-red-600">{art.author}</span>
                          <span>•</span>
                          <span>{new Date(art.publishedAt).toLocaleDateString('hi-IN')}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                            👁️ {art.views || 0} बार देखा गया (Views)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleStartEdit(art)}
                        className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                        title="खबर संपादित करें (Edit Post)"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>संपादित करें</span>
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="flex items-center gap-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                        title="वेबसाइट से हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==================================================== */}
        {/* 3. BREAKING TICKER MANAGER */}
        {/* ==================================================== */}
        {activeTab === 'breaking' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                लाल पट्टी ब्रेकिंग टिकर प्रबंधन
              </h3>
              <p className="text-xs text-gray-500">
                वेबसाइट के शीर्ष पर चलने वाली ताज़ा खबरों में नया अलर्ट जोड़ें या हटाएं।
              </p>
            </div>

            <form onSubmit={handleAddTicker} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                placeholder="नया ब्रेकिंग न्यूज़ अलर्ट लिखें..."
                className="flex-1 px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm font-hindi text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0"
              >
                + जोड़ें
              </button>
            </form>

            <div className="space-y-2">
              {breakingNews.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between text-xs gap-3"
                >
                  <span className="font-hindi text-gray-800 dark:text-gray-200">
                    ⚡ {item}
                  </span>
                  <button
                    onClick={() => handleDeleteTicker(idx)}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
