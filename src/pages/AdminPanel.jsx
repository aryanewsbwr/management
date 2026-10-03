import React, { useState, useEffect } from 'react';
import { BarChart2, Megaphone, Clock, MessageCircle, 
  Lock, User, Key, Eye, EyeOff, ShieldCheck, CheckCircle2, 
  AlertCircle, Upload, Image as ImageIcon, Trash2, ExternalLink, 
  LogOut, PlusCircle, ArrowLeft, RefreshCw, Sparkles, TrendingUp, Save,
  Edit3, Radio, PowerOff, Video, Film, Play, X, Layers,
  Scissors, RotateCcw, Camera
} from 'lucide-react';
import { AGENCY_INFO } from '../data/categories';
import { StorageService } from '../services/storage';
import { compressImage } from '../utils/imageCompressor';
import { getArticleThumbnail } from '../utils/mediaHelper';

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

  // Live API News Kill Switch State
  const [isApiNewsEnabled, setIsApiNewsEnabled] = useState(true);
  const [isTogglingKillSwitch, setIsTogglingKillSwitch] = useState(false);

  // Form State for Non-Tech Upload & Edit
  const [editingArticle, setEditingArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('संवाददाता, ब्यावर');
  const [area, setArea] = useState('चांग गेट, ब्यावर');
  const [mediaCaption, setMediaCaption] = useState('फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)');

  // Media Mode: 'photos' (Single/Multiple Photos for Auto-Carousel) | 'video' (Short Video Clip)
  const [mediaMode, setMediaMode] = useState('photos');
  
  // Gallery Items: array of { id, file, blob, dataUrl, isExisting }
  const [galleryItems, setGalleryItems] = useState([]);
  
  // Video State
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoPosterFile, setVideoPosterFile] = useState(null);
  const [videoPosterPreview, setVideoPosterPreview] = useState('');
  const [videoTrimStart, setVideoTrimStart] = useState('');
  const [videoTrimEnd, setVideoTrimEnd] = useState('');
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = React.useRef(null);
  const [videoSizeMb, setVideoSizeMb] = useState('');

  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Uploaded Beawar articles list
  const [beawarArticles, setBeawarArticles] = useState([]);

  // Mandi & Breaking States
  const [breakingNews, setBreakingNews] = useState([]);
  // Advertisements Management States
  const [adsList, setAdsList] = useState([]);
  const [editingAd, setEditingAd] = useState(null);
  const [adBusinessName, setAdBusinessName] = useState('');
  const [adAbout, setAdAbout] = useState('');
  const [adMediaUrl, setAdMediaUrl] = useState('');
  const [adMediaType, setAdMediaType] = useState('image');
  
  // Multiple Action Buttons States (Collapsible / Optional)
  const [adEnableWhatsApp, setAdEnableWhatsApp] = useState(false);
  const [adWhatsAppNumber, setAdWhatsAppNumber] = useState('');
  const [adEnableCall, setAdEnableCall] = useState(false);
  const [adCallNumber, setAdCallNumber] = useState('');
  const [adEnableMaps, setAdEnableMaps] = useState(false);
  const [adMapsUrl, setAdMapsUrl] = useState('');
  const [adEnableWebsite, setAdEnableWebsite] = useState(false);
  const [adWebsiteUrl, setAdWebsiteUrl] = useState('');

  const [adDuration, setAdDuration] = useState('7d');
  const [adCustomDays, setAdCustomDays] = useState('3');
  const [adDisplayStyle, setAdDisplayStyle] = useState('poster');
  
  // Multiple Placements States (Multi-select)
  const [adPlacementBanner, setAdPlacementBanner] = useState(true);
  const [adPlacementFeed, setAdPlacementFeed] = useState(true);
  const [adPlacementArticle, setAdPlacementArticle] = useState(true);

  const [isAdSubmitting, setIsAdSubmitting] = useState(false);
  const [isAdMediaUploading, setIsAdMediaUploading] = useState(false);

  const [bullionRates, setBullionRates] = useState([
    { id: 'gold_24k', item: '24K सोना (Gold 24K)', unit: '10 ग्राम', price: '' },
    { id: 'gold_22k', item: '22K सोना (Gold 22K)', unit: '10 ग्राम', price: '' },
    { id: 'gold_18k', item: '18K सोना (Gold 18K)', unit: '10 ग्राम', price: '' },
    { id: 'silver_1kg', item: 'चांदी (Silver 999)', unit: '1 किलो', price: '' },
    { id: 'silver_100g', item: 'चांदी टंच (Silver 100g)', unit: '100 ग्राम', price: '' }
  ]);
  const [bullionLastUpdated, setBullionLastUpdated] = useState(null);
  const [bullionEnabled, setBullionEnabled] = useState(true);
  const [isBullionSaving, setIsBullionSaving] = useState(false);
  const [isTogglingBullion, setIsTogglingBullion] = useState(false);

  const [newTicker, setNewTicker] = useState('');

  // ADVERTISEMENT HANDLERS
  const handleStartEditAd = (ad) => {
    setEditingAd(ad);
    setAdBusinessName(ad.businessName || '');
    setAdAbout(ad.about || '');
    setAdMediaUrl(ad.mediaUrl || '');
    setAdMediaType(ad.mediaType || 'image');
    setAdDisplayStyle(ad.displayStyle || 'poster');
    
    setAdDuration(ad.duration || '7d');
    setAdCustomDays(ad.customDays || '3');

    const placements = ad.placements || (ad.placement ? (ad.placement === 'all' ? ['banner', 'feed', 'article'] : ad.placement.split(',')) : ['banner', 'feed', 'article']);
    setAdPlacementBanner(placements.includes('banner'));
    setAdPlacementFeed(placements.includes('feed'));
    setAdPlacementArticle(placements.includes('article'));

    const actions = ad.actions && ad.actions.length > 0 
      ? ad.actions 
      : (ad.actionType ? [{ type: ad.actionType, target: ad.actionTarget }] : []);
    
    const wa = actions.find(a => a.type === 'whatsapp');
    setAdEnableWhatsApp(!!wa);
    setAdWhatsAppNumber(wa ? wa.target : '');

    const cl = actions.find(a => a.type === 'call');
    setAdEnableCall(!!cl);
    setAdCallNumber(cl ? cl.target : '');

    const mp = actions.find(a => a.type === 'maps');
    setAdEnableMaps(!!mp);
    setAdMapsUrl(mp ? mp.target : '');

    const ws = actions.find(a => a.type === 'website');
    setAdEnableWebsite(!!ws);
    setAdWebsiteUrl(ws ? ws.target : '');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditAd = () => {
    setEditingAd(null);
    setAdBusinessName('');
    setAdAbout('');
    setAdMediaUrl('');
    setAdDisplayStyle('poster');
    setAdEnableWhatsApp(false);
    setAdWhatsAppNumber('');
    setAdEnableCall(false);
    setAdCallNumber('');
    setAdEnableMaps(false);
    setAdMapsUrl('');
    setAdEnableWebsite(false);
    setAdWebsiteUrl('');
    setAdPlacementBanner(true);
    setAdPlacementFeed(true);
    setAdPlacementArticle(true);
  };

  const handleAdMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAdMediaUploading(true);
    try {
      const isVideo = file.type.startsWith('video/');
      setAdMediaType(isVideo ? 'video' : 'image');
      const uploadedUrl = await StorageService.uploadArticleMedia(file);
      setAdMediaUrl(uploadedUrl);
    } catch (err) {
      alert(err.message || 'Media upload failed');
    } finally {
      setIsAdMediaUploading(false);
    }
  };

  const handleSaveAd = async (e) => {
    e.preventDefault();
    if (!adBusinessName.trim()) {
      alert('कृपया व्यापार / कंपनी का नाम भरें।');
      return;
    }

    const actions = [];
    if (adEnableWhatsApp && adWhatsAppNumber.trim()) {
      actions.push({ type: 'whatsapp', target: adWhatsAppNumber.trim() });
    }
    if (adEnableCall && adCallNumber.trim()) {
      actions.push({ type: 'call', target: adCallNumber.trim() });
    }
    if (adEnableMaps && adMapsUrl.trim()) {
      actions.push({ type: 'maps', target: adMapsUrl.trim() });
    }
    if (adEnableWebsite && adWebsiteUrl.trim()) {
      actions.push({ type: 'website', target: adWebsiteUrl.trim() });
    }

    if (actions.length === 0) {
      alert('कृपया कम से कम एक कॉल-टू-एक्शन बटन (Action Button) चालू करें और उसका नंबर/लिंक भरें।');
      return;
    }

    const placements = [];
    if (adPlacementBanner) placements.push('banner');
    if (adPlacementFeed) placements.push('feed');
    if (adPlacementArticle) placements.push('article');

    if (placements.length === 0) {
      alert('कृपया कम से कम एक विज्ञापन स्थान (Placement) चुनें।');
      return;
    }

    setIsAdSubmitting(true);
    try {
      const adData = {
        ...(editingAd ? { id: editingAd.id, createdAt: editingAd.createdAt, views: editingAd.views || 0, clicks: editingAd.clicks || 0 } : {}),
        businessName: adBusinessName.trim(),
        about: adAbout.trim(),
        mediaUrl: adMediaUrl || null,
        mediaType: adMediaType,
        displayStyle: adDisplayStyle,
        actions: actions,
        actionType: actions[0].type,
        actionTarget: actions[0].target,
        placements: placements,
        placement: placements.length === 3 ? 'all' : placements.join(','),
        duration: adDuration,
        customDays: adCustomDays,
        isHidden: editingAd ? editingAd.isHidden : false
      };
      await StorageService.saveAdvertisement(adData);
      const updated = await StorageService.fetchAdvertisements();
      setAdsList(updated);
      if (onNewsUpdated) onNewsUpdated();
      // Reset form cleanly
      handleCancelEditAd();
      alert(editingAd ? 'विज्ञापन सफलतापूर्वक अपडेट कर दिया गया है!' : 'विज्ञापन सफलतापूर्वक प्रकाशित कर दिया गया है!');
    } catch (err) {
      alert(err.message || 'Error saving ad');
    } finally {
      setIsAdSubmitting(false);
    }
  };

  const handleToggleAdVisibility = async (ad) => {
    try {
      const updatedAd = { ...ad, isHidden: !ad.isHidden };
      await StorageService.saveAdvertisement(updatedAd);
      const updated = await StorageService.fetchAdvertisements();
      setAdsList(updated);
      if (onNewsUpdated) onNewsUpdated();
    } catch (err) {
      alert(`विजिबिलिटी बदलने में त्रुटि: ${err.message}`);
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('क्या आप सचमुच इस विज्ञापन को हटाना चाहते हैं?')) return;
    try {
      await StorageService.deleteAdvertisement(id);
      setAdsList(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveBullionRates = async (e) => {
    e.preventDefault();
    setIsBullionSaving(true);
    try {
      await StorageService.saveBullionRates(bullionRates);
      const res = await StorageService.fetchBullionRates();
      setBullionRates(res.rates);
      setBullionLastUpdated(res.lastUpdatedAt);
      alert('ब्यावर सर्राफा भाव सफलतापूर्वक अपडेट हो चुके हैं!');
    } catch (err) {
      alert(err.message || 'Error saving bullion rates');
    } finally {
      setIsBullionSaving(false);
    }
  };

  const handleBullionPriceChange = (id, newPrice) => {
    setBullionRates(prev => prev.map(r => r.id === id ? { ...r, price: newPrice } : r));
  };

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
      const [customArticles, bn, mcxRes, apiNewsStatus, ads] = await Promise.all([
        StorageService.fetchCustomArticles(),
        StorageService.fetchBreakingNews(),
        StorageService.fetchBullionRates(),
        StorageService.fetchApiNewsEnabled(),
        StorageService.fetchAdvertisements()
      ]);
      setAdsList(ads || []);
      setBeawarArticles(customArticles.filter(a => a.category === 'beawar'));
      setBreakingNews(bn || []);
      if (mcxRes && mcxRes.rates && mcxRes.rates.length > 0) {
        setBullionRates(mcxRes.rates);
      }
      if (mcxRes) {
        setBullionLastUpdated(mcxRes.lastUpdatedAt);
        if (typeof mcxRes.enabled === 'boolean') {
          setBullionEnabled(mcxRes.enabled);
        }
      }

      setIsApiNewsEnabled(apiNewsStatus);
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

  // Toggle Live API News Kill Switch (Persisted in Supabase & Local Cache)
  const handleToggleKillSwitch = async () => {
    setIsTogglingKillSwitch(true);
    try {
      const nextStatus = !isApiNewsEnabled;
      await StorageService.setApiNewsEnabled(nextStatus);
      setIsApiNewsEnabled(nextStatus);
      if (onNewsUpdated) onNewsUpdated();
      alert(nextStatus
        ? '✅ लाइव API समाचार सफलतापूर्वक चालू कर दिए गए हैं। अब राजस्थान, देश, खेल व अन्य श्रेणियां भी दर्शकों को दिखेंगी।'
        : '⛔ लाइव API समाचार पूरी तरह बंद (किल) कर दिए गए हैं। अब वेबसाइट पर केवल ब्यावर की स्थानीय खबरें प्रदर्शित होंगी।'
      );
    } catch (err) {
      alert(`किल-स्विच अपडेट करने में त्रुटि: ${err.message}`);
    } finally {
      setIsTogglingKillSwitch(false);
    }
  };

  // Toggle Beawar Sarrafa Bhav Kill Switch (Persisted in Supabase & Local Cache)
  const handleToggleBullionKillSwitch = async () => {
    const nextStatus = !bullionEnabled;
    setIsTogglingBullion(true);
    try {
      await StorageService.setBullionEnabled(nextStatus);
      setBullionEnabled(nextStatus);
      if (onNewsUpdated) onNewsUpdated();
      alert(nextStatus
        ? '✅ ब्यावर सर्राफा भाव टिकर चालू कर दिया गया है। वेबसाइट पर पाठकों को यह दिखेगा।'
        : '⛔ ब्यावर सर्राफा भाव टिकर बंद (Hide) कर दिया गया है। वेबसाइट पर यह पैनल अब पूरी तरह छिप गया है।'
      );
    } catch (err) {
      alert(`सर्राफा टिकर स्थिति बदलने में त्रुटि: ${err.message}`);
    } finally {
      setIsTogglingBullion(false);
    }
  };

  // Start Editing an existing Beawar article
  const handleStartEdit = (article) => {
    setEditingArticle(article);
    setTitle(article.titleHi || '');
    setContent(article.contentHi || '');
    setMediaCaption(article.mediaCaption || 'फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)');

    const rawAuthor = article.author || 'संवाददाता, ब्यावर';
    const match = rawAuthor.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    if (match && match[2]) {
      setAuthor(match[1].trim());
      setArea(match[2].trim());
    } else {
      setAuthor(rawAuthor);
      setArea('चांग गेट, ब्यावर');
    }

    // Media Setup
    if (article.videoUrl || article.mediaType === 'video') {
      setMediaMode('video');
      setVideoFile(null);
      setVideoPreviewUrl(article.videoUrl || '');
      setVideoPosterPreview(article.image || '');
      setVideoPosterFile(null);
      setGalleryItems([]);
    } else {
      setMediaMode('photos');
      const gallery = article.gallery && article.gallery.length > 0 
        ? article.gallery 
        : (article.image ? [article.image] : []);
      
      setGalleryItems(gallery.map((url, i) => ({
        id: `existing-${i}-${Date.now()}`,
        dataUrl: url,
        isExisting: true
      })));
      setVideoFile(null);
      setVideoPreviewUrl('');
    }

    setUploadSuccess('');
    setUploadStatusText('');
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setTitle('');
    setContent('');
    setMediaCaption('फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)');
    setAuthor('संवाददाता, ब्यावर');
    setArea('चांग गेट, ब्यावर');
    setMediaMode('photos');
    setGalleryItems([]);
    setVideoFile(null);
    setVideoPreviewUrl('');
    setVideoPosterFile(null);
    setVideoPosterPreview('');
    setVideoSizeMb('');
    setUploadSuccess('');
    setUploadStatusText('');
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

  // Multiple Photos Picker with Client-Side Canvas Compression
  const handleMultipleImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.filter(f => f.size > 20 * 1024 * 1024);
    if (oversized.length > 0) {
      alert('कृपया 20MB से छोटी फोटो चुनें।');
      return;
    }

    setIsCompressingImage(true);
    try {
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const { dataUrl, blob } = await compressImage(file);
          newItems.push({
            id: `new-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
            file,
            blob,
            dataUrl,
            isExisting: false
          });
        } catch (err) {
          console.warn('Canvas compression fallback to raw file:', err);
          const rawUrl = URL.createObjectURL(file);
          newItems.push({
            id: `new-${Date.now()}-${i}`,
            file,
            blob: file,
            dataUrl: rawUrl,
            isExisting: false
          });
        }
      }
      setGalleryItems(prev => [...prev, ...newItems]);
    } finally {
      setIsCompressingImage(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (idToRemove) => {
    setGalleryItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const handleMakeCoverPhoto = (indexToMove) => {
    setGalleryItems(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(indexToMove, 1);
      return [moved, ...updated];
    });
  };

  // Video File Picker
  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > 50 * 1024 * 1024) {
      alert(`वीडियो का आकार ${sizeMb} MB है। सुचारू अपलोड के लिए कृपया 50 MB से कम का शॉर्ट वीडियो चुनें।`);
      return;
    }

    setVideoSizeMb(sizeMb);
    setVideoFile(file);
    const objUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objUrl);
    e.target.value = '';
  };

  const handleCaptureThumbnail = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setVideoPosterPreview(dataUrl);
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
      setVideoPosterFile(file);
    } catch(e) { console.error('Capture error:', e); }
  };

  const handleSetTrimStart = () => {
    if (!videoRef.current) return;
    setVideoTrimStart(videoRef.current.currentTime.toFixed(1));
  };

  const handleSetTrimEnd = () => {
    if (!videoRef.current) return;
    setVideoTrimEnd(videoRef.current.currentTime.toFixed(1));
  };

  const handleResetTrim = () => {
    setVideoTrimStart('');
    setVideoTrimEnd('');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handlePreviewTrim = () => {
    if (!videoRef.current) return;
    const start = parseFloat(videoTrimStart) || 0;
    const end = parseFloat(videoTrimEnd) || (videoRef.current.duration || 1000);
    videoRef.current.currentTime = start;
    videoRef.current.play();

    const checkInterval = setInterval(() => {
      if (!videoRef.current || videoRef.current.paused) {
        clearInterval(checkInterval);
        return;
      }
      if (videoRef.current.currentTime >= end) {
        videoRef.current.pause();
        clearInterval(checkInterval);
      }
    }, 100);
  };

  // Video Poster / Cover Image Picker
  const handleVideoPosterChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { dataUrl, blob } = await compressImage(file);
      const imgFile = new File([blob], file.name || 'cover.jpg', { type: blob.type || 'image/jpeg' });
      setVideoPosterFile(imgFile);
      setVideoPosterPreview(dataUrl);
    } catch {
      setVideoPosterFile(file);
      setVideoPosterPreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  // Handle Beawar News Publish or Update (Supports Multi-Photos Carousel & Video)
  const handlePublishNews = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('कृपया खबर का शीर्षक और विवरण दोनों भरें।');
      return;
    }

    if (mediaMode === 'video' && !videoPreviewUrl && !videoFile) {
      alert('कृपया एक शॉर्ट वीडियो क्लिप चुनें या फोटो मोड चुनें।');
      return;
    }

    setIsSubmitting(true);
    setUploadSuccess('');
    setUploadStatusText('');

    try {
      let finalGallery = [];
      let finalVideoUrl = null;
      let finalPrimaryImage = '';

      if (mediaMode === 'video') {
        // 1. Upload Video Clip
        if (videoFile) {
          setUploadStatusText('🎥 वीडियो अपलोड हो रहा है... कृपया प्रतीक्षा करें');
          try {
            finalVideoUrl = await StorageService.uploadArticleMedia(videoFile);
          } catch (vidErr) {
            console.error('[Admin] Video upload failed:', vidErr);
            throw new Error(`वीडियो अपलोड करने में विफलता: ${vidErr.message}`);
          }
        } else {
          finalVideoUrl = videoPreviewUrl;
        }

        // Apply trimming to Cloudinary video URL if set
        if (finalVideoUrl && finalVideoUrl.includes('cloudinary.com') && (videoTrimStart || videoTrimEnd)) {
          const start = parseFloat(videoTrimStart) || 0;
          const end = parseFloat(videoTrimEnd) || 0;
          let trimParams = [];
          if (start > 0) trimParams.push(`so_${Math.round(start)}`);
          if (end > start) trimParams.push(`eo_${Math.round(end)}`);
          if (trimParams.length > 0 && finalVideoUrl.includes('/video/upload/') && !finalVideoUrl.includes('/so_')) {
            finalVideoUrl = finalVideoUrl.replace('/video/upload/', `/video/upload/${trimParams.join(',')}/`);
          }
        }

        // 2. Upload Video Cover/Poster & Any Attached Photos
        const uploadedGallery = [];

        // Upload any photos present in galleryItems
        for (let i = 0; i < galleryItems.length; i++) {
          const item = galleryItems[i];
          if (item.isExisting && item.dataUrl && item.dataUrl.startsWith('http')) {
            uploadedGallery.push(item.dataUrl);
          } else if (item.blob || item.file) {
            setUploadStatusText(`📷 संलग्न फोटो ${i + 1}/${galleryItems.length} अपलोड हो रही है...`);
            try {
              const fileObj = item.file || (item.blob instanceof File ? item.blob : new File([item.blob], `photo_${i}.jpg`, { type: item.blob.type || 'image/jpeg' }));
              const uploadedUrl = await StorageService.uploadArticleMedia(fileObj);
              uploadedGallery.push(uploadedUrl);
            } catch (upErr) {
              console.error('[Admin] Attached photo upload failed:', upErr);
              throw new Error(`संलग्न फोटो अपलोड करने में विफलता: ${upErr.message}`);
            }
          }
        }

        // Upload specific video poster file if user picked one
        if (videoPosterFile) {
          setUploadStatusText('🖼️ वीडियो थंबनेल / कवर फोटो अपलोड हो रही है...');
          try {
            const posterFileObj = videoPosterFile instanceof File 
              ? videoPosterFile 
              : new File([videoPosterFile], 'cover.jpg', { type: videoPosterFile.type || 'image/jpeg' });
            finalPrimaryImage = await StorageService.uploadArticleMedia(posterFileObj);
          } catch (posterErr) {
            console.error('[Admin] Video poster upload failed:', posterErr);
            throw new Error(`वीडियो कवर फोटो अपलोड करने में विफलता: ${posterErr.message}`);
          }
        } else if (videoPosterPreview && videoPosterPreview.startsWith('http')) {
          finalPrimaryImage = videoPosterPreview;
        } else if (uploadedGallery.length > 0) {
          finalPrimaryImage = uploadedGallery[0];
        } else if (finalVideoUrl) {
          // Automatically extract high-quality video poster from Cloudinary if not custom uploaded
          finalPrimaryImage = getArticleThumbnail({ videoUrl: finalVideoUrl });
        } else {
          finalPrimaryImage = '';
        }

        // Build final gallery: Ensure finalPrimaryImage is at index 0 and unique
        if (finalPrimaryImage && !uploadedGallery.includes(finalPrimaryImage)) {
          finalGallery = [finalPrimaryImage, ...uploadedGallery];
        } else {
          finalGallery = uploadedGallery.length > 0 ? uploadedGallery : (finalPrimaryImage ? [finalPrimaryImage] : []);
        }

      } else {
        // PHOTOS / GALLERY MODE
        if (galleryItems.length === 0) {
          finalPrimaryImage = '';
          finalGallery = [finalPrimaryImage];
        } else {
          for (let i = 0; i < galleryItems.length; i++) {
            const item = galleryItems[i];
            if (item.isExisting && item.dataUrl && item.dataUrl.startsWith('http')) {
              finalGallery.push(item.dataUrl);
            } else if (item.blob || item.file) {
              setUploadStatusText(`📷 फोटो ${i + 1}/${galleryItems.length} अपलोड हो रही है...`);
              try {
                const uploadedUrl = await StorageService.uploadArticleMedia(item.blob || item.file);
                finalGallery.push(uploadedUrl);
              } catch (upErr) {
                console.warn('[Admin] Storage upload failed for photo, using compressed data URL:', upErr.message);
                finalGallery.push(item.dataUrl);
              }
            } else if (item.dataUrl) {
              finalGallery.push(item.dataUrl);
            }
          }
          finalPrimaryImage = finalGallery[0];
        }
      }

      setUploadStatusText('💾 खबर डेटाबेस में सुरक्षित हो रही है...');

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
        image: finalPrimaryImage,
        gallery: finalGallery,
        videoUrl: finalVideoUrl,
        mediaType: mediaMode === 'video' ? 'video' : (finalGallery.length > 1 ? 'gallery' : 'image'),
        mediaCaption: mediaCaption.trim(),
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
      setUploadStatusText('');
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
  const handleToggleHideArticle = async (article) => { if (confirm(`Are you sure you want to ${article.isHidden ? 'SHOW' : 'HIDE'} this news on the main website?`)) { try { await StorageService.saveArticle({ ...article, isHidden: !article.isHidden }); await loadData(); if (onNewsUpdated) onNewsUpdated(); } catch (err) { alert(`Failed to update: ${err.message}`); } } };

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
          <button
            onClick={() => setActiveTab('bullion')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'bullion'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>🪙 ब्यावर सर्राफा भाव</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>📊 एनालिटिक्स (Analytics)</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'ads'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-300" />
            <span>📢 विज्ञापन प्रबंधक ({adsList.filter(a => a.isActive).length} सक्रिय)</span>
          </button>

        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 flex-1">
        
        {/* ==================================================== */}
        {/* LIVE API NEWS KILL SWITCH CONTROL BANNER */}
        {/* ==================================================== */}
        <div className={`mb-6 p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-sm ${
          isApiNewsEnabled
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                isApiNewsEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 text-white animate-pulse'
              }`}>
                {isApiNewsEnabled ? <Radio className="w-6 h-6" /> : <PowerOff className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black font-hindi text-gray-950 dark:text-white">
                    लाइव API समाचार नियंत्रण (Live News Kill Switch)
                  </h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isApiNewsEnabled
                      ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-red-200 text-red-950 dark:bg-red-900 dark:text-red-200 animate-bounce'
                  }`}>
                    {isApiNewsEnabled ? '● चालू (Active)' : '■ किल-स्विच चालू (Killed)'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-hindi mt-1 leading-relaxed">
                  {isApiNewsEnabled 
                    ? 'वेबसाइट पर राजस्थान, देश, खेल, मनोरंजन, व्यापार और ब्यावर की सभी खबरें सुचारू रूप से दिखाई दे रही हैं।' 
                    : '⚠️ चेतावनी: बाहरी API समाचार पूरी तरह बंद हैं। वेबसाइट पर केवल ब्यावर की स्थानीय खबरें प्रदर्शित हो रही हैं।'
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isTogglingKillSwitch}
              onClick={handleToggleKillSwitch}
              className={`self-start sm:self-center px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm font-hindi transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap ${
                isApiNewsEnabled
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {isTogglingKillSwitch ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>अपडेट हो रहा है...</span>
                </>
              ) : isApiNewsEnabled ? (
                <>
                  <PowerOff className="w-4 h-4" />
                  <span>⛔ API न्यूज़ बंद करें (केवल ब्यावर दिखाएं)</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>✅ API न्यूज़ फिर से चालू करें</span>
                </>
              )}
            </button>
          </div>
        </div>

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

              {/* 2. Media Upload: Multiple Photos Auto-Carousel OR Short Video */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700/80 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div>
                    <label className="block text-sm font-black font-hindi text-gray-900 dark:text-white">
                      2. खबर का मीडिया (फोटो कैरोज़ल अथवा शॉर्ट वीडियो) *
                    </label>
                    <p className="text-xs text-gray-500 font-hindi mt-0.5">
                      आप एक या एक से अधिक फोटो (जो वेबसाइट पर ऑटो-स्लाइड होंगी) या शॉर्ट वीडियो क्लिप जोड़ सकते हैं।
                    </p>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-700 p-1 rounded-xl shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setMediaMode('photos')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        mediaMode === 'photos'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>फोटो / कैरोज़ल</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaMode('video')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        mediaMode === 'video'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>शॉर्ट वीडियो</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: MULTIPLE PHOTOS (AUTO-CAROUSEL) */}
                {mediaMode === 'photos' && (
                  <div className="space-y-3">
                    
                    {/* Upload Trigger Button */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition shadow-sm text-xs font-bold text-gray-900 dark:text-white">
                        <Upload className="w-4 h-4 text-red-600" />
                        <span>गैलरी / कंप्यूटर से फोटो चुनें (1 या अधिक)</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMultipleImagesChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-gray-500 font-hindi">
                        (एक साथ कई फोटो चुन सकते हैं • JPG, PNG)
                      </span>
                    </div>

                    {/* Compression indicator */}
                    {isCompressingImage && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-200">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                        <span>फोटो ऑप्टिमाइज़ की जा रही हैं... कृपया प्रतीक्षा करें</span>
                      </div>
                    )}

                    {/* Multiple Photos Thumbnails Grid */}
                    {galleryItems.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {galleryItems.map((item, idx) => (
                            <div 
                              key={item.id} 
                              className={`relative rounded-xl overflow-hidden bg-gray-900 border-2 aspect-[4/3] group shadow-sm ${
                                idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <img
                                src={item.dataUrl}
                                alt={`Preview ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Top Badge: Cover Photo or Index */}
                              <div className="absolute top-1.5 left-1.5 z-10">
                                {idx === 0 ? (
                                  <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-md shadow">
                                    ★ मुख्य कवर फोटो
                                  </span>
                                ) : (
                                  <span className="bg-black/70 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                                    फोटो {idx + 1}
                                  </span>
                                )}
                              </div>

                              {/* Top Right: Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(item.id)}
                                className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow hover:scale-110 active:scale-95 transition"
                                title="यह फोटो हटाएं"
                              >
                                ✕
                              </button>

                              {/* Bottom: Make Cover action on hover if not cover */}
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMakeCoverPhoto(idx)}
                                  className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 hover:bg-emerald-700 text-white text-[10px] font-bold py-1 rounded transition opacity-90 group-hover:opacity-100"
                                >
                                  मुख्य बनाएं
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Informative Carousel Notice */}
                        {galleryItems.length > 1 && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 font-hindi">
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              शानदार! कुल {galleryItems.length} फोटो चुनी गई हैं। वेबसाइट पर पाठक इसे 3.5 सेकंड के ऑटोमैटिक स्लाइडिंग कैरोज़ल में देख सकेंगे।
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-850">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 font-hindi">
                          अभी कोई फोटो नहीं चुनी गई है।
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          (अगर फोटो नहीं चुनेंगे तो ब्यावर की मानक हेरिटेज फोटो स्वतः लग जाएगी)
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* TAB 2: SHORT VIDEO UPLOAD */}
                {mediaMode === 'video' && (
                  <div className="space-y-4">
                    
                    {/* Video File Picker */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition shadow-sm text-xs font-bold text-gray-900 dark:text-white">
                        <Video className="w-4 h-4 text-red-600" />
                        <span>शॉर्ट वीडियो क्लिप चुनें (MP4, WebM)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/*"
                          onChange={handleVideoFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-gray-500 font-hindi">
                        (सुचारू स्ट्रीमिंग हेतु 50MB से कम का वीडियो रखें)
                      </span>
                    </div>

                    {/* Video Preview Player & Trimming Suite */}
                    {videoPreviewUrl ? (
                      <div className="space-y-4 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                        {/* Video Player */}
                        <div className="relative rounded-xl overflow-hidden bg-black shadow-md border border-gray-800">
                          <video
                            ref={videoRef}
                            crossOrigin="anonymous"
                            src={videoPreviewUrl}
                            controls
                            playsInline
                            onTimeUpdate={(e) => setVideoCurrentTime(e.target.currentTime)}
                            onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                            className="w-full max-h-60 object-contain mx-auto"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVideoFile(null);
                              setVideoPreviewUrl('');
                              setVideoSizeMb('');
                              setVideoTrimStart('');
                              setVideoTrimEnd('');
                            }}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full text-xs shadow-lg transition"
                            title="वीडियो हटाएं"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Live Playback Timer & Status */}
                        <div className="flex items-center justify-between text-xs font-mono text-gray-600 dark:text-gray-300 px-1">
                          <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white font-hindi">
                            <Clock className="w-3.5 h-3.5 text-red-600" />
                            <span>वर्तमान समय: {videoCurrentTime.toFixed(1)}s / {videoDuration.toFixed(1)}s</span>
                          </div>
                          <span className="text-[11px] text-gray-500 font-hindi">
                            आकार: {videoSizeMb ? `${videoSizeMb} MB` : 'तैयार'}
                          </span>
                        </div>

                        {/* ✂️ VIDEO TRIMMER & FRAME CAPTURE TOOLBAR */}
                        <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold font-hindi text-gray-900 dark:text-white flex items-center gap-1.5">
                              <Scissors className="w-3.5 h-3.5 text-red-600" />
                              <span>वीडियो ट्रिम टूल (Video Trimming & Capture)</span>
                            </span>
                            {(videoTrimStart || videoTrimEnd) && (
                              <button
                                type="button"
                                onClick={handleResetTrim}
                                className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>रीसेट ट्रिम</span>
                              </button>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <button
                              type="button"
                              onClick={handleSetTrimStart}
                              className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-800 dark:text-gray-200 hover:text-red-600 rounded-xl text-xs font-bold transition border border-gray-200 dark:border-gray-600 active:scale-95"
                              title="वर्तमान वीडियो स्थिति को शुरू का समय बनाएं"
                            >
                              <Scissors className="w-3.5 h-3.5 text-red-600" />
                              <span>शुरू: {videoTrimStart ? `${videoTrimStart}s` : 'सेट करें'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleSetTrimEnd}
                              className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-800 dark:text-gray-200 hover:text-red-600 rounded-xl text-xs font-bold transition border border-gray-200 dark:border-gray-600 active:scale-95"
                              title="वर्तमान वीडियो स्थिति को अंतिम समय बनाएं"
                            >
                              <Scissors className="w-3.5 h-3.5 text-red-600 rotate-180" />
                              <span>अंत: {videoTrimEnd ? `${videoTrimEnd}s` : 'सेट करें'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handlePreviewTrim}
                              className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition border border-blue-200 dark:border-blue-900 active:scale-95"
                              title="ट्रिम किया हुआ भाग चलाकर देखें"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>ट्रिम चलाएं</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleCaptureThumbnail}
                              className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                              title="वर्तमान फ्रेम को थंबनेल / कवर फोटो बनाएं"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>फ्रेम थंबनेल बनाएं</span>
                            </button>
                          </div>

                          {(videoTrimStart || videoTrimEnd) && (
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between font-hindi">
                              <span>✓ ट्रिम सक्रिय: {videoTrimStart || 0}s से {videoTrimEnd || `${videoDuration.toFixed(1)}s`} तक</span>
                              <span>अवधि: {((parseFloat(videoTrimEnd || videoDuration) - parseFloat(videoTrimStart || 0))).toFixed(1)}s</span>
                            </div>
                          )}
                        </div>

                        {/* Thumbnail Cover Photo Preview */}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                          <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg text-xs font-bold cursor-pointer transition">
                            <ImageIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                            <span>कस्टम कवर फोटो अपलोड करें (वैकल्पिक)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleVideoPosterChange}
                              className="hidden"
                            />
                          </label>
                          {videoPosterPreview && (
                            <div className="flex items-center gap-2">
                              <img src={videoPosterPreview} alt="" className="w-12 h-9 object-cover rounded-lg border shadow-sm" />
                              <span className="text-xs text-emerald-600 font-bold">
                                ✓ थंबनेल सेट है
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-850">
                        <Film className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 font-hindi">
                          अभी कोई वीडियो क्लिप नहीं चुनी गई है।
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          (घटनास्थल, रैली, उद्घाटन या जनसमस्या का छोटा वीडियो अपलोड करें)
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* 3. Media Caption */}
              <div>
                <label className="block text-sm font-black font-hindi text-gray-800 dark:text-gray-200 mb-1.5">
                  3. फोटो / वीडियो का कैप्शन (Media Caption)
                </label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-hindi focus:border-red-500 focus:bg-white dark:focus:bg-gray-850 focus:outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* 4. Full Story Description */}
              <div>
                <label className="block text-sm font-black font-hindi text-gray-800 dark:text-gray-200 mb-1.5">
                  4. खबर का पूरा विवरण (Full News Content) *
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

              {/* 5 & 6. Reporter Name & Area in Beawar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    5. संवाददाता / ब्यूरो का नाम
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
                    6. क्षेत्र / वार्ड (Area in Beawar)
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

              {/* Live Upload Progress Indicator */}
              {uploadStatusText && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 rounded-2xl text-xs font-bold flex items-center gap-2.5 border-2 border-amber-300 dark:border-amber-700 animate-pulse font-hindi">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                  <span>{uploadStatusText}</span>
                </div>
              )}

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
                        src={getArticleThumbnail(art)}
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
                          {art.videoUrl ? (
                            <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900">
                              🎥 वीडियो
                            </span>
                          ) : art.gallery && art.gallery.length > 1 ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                              📷 {art.gallery.length} फोटो कैरोज़ल
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                          onClick={() => handleToggleHideArticle(art)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${ art.isHidden ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300' }`}
                          title={art.isHidden ? 'Show on Website' : 'Hide from Website'}
                        >
                          {art.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{art.isHidden ? 'Show' : 'Hide'}</span>
                        </button>
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

        {/* ==================================================== */}
        
        {/* ==================================================== */}
        {/* 5. BEAWAR SARRAFA BHAV (BULLION RATES MANAGER) */}
        {/* ==================================================== */}
        {activeTab === 'bullion' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
            
            {/* Bullion Kill Switch Control Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              bullionEnabled
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800/60'
            }`}>
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow ${
                  bullionEnabled ? 'bg-amber-600' : 'bg-red-600 animate-pulse'
                }`}>
                  {bullionEnabled ? <TrendingUp className="w-5 h-5 text-white" /> : <PowerOff className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black font-hindi text-gray-900 dark:text-white">
                      सर्राफा भाव टिकर स्थिति (Bullion Ticker Kill Switch)
                    </h4>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      bullionEnabled
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {bullionEnabled ? '● चालू (Live Visible)' : '■ बंद / छिपा हुआ (Hidden)'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-hindi mt-0.5">
                    {bullionEnabled 
                      ? 'वेबसाइट के शीर्ष पर ब्यावर सर्राफा भाव टिकर सभी पाठकों को लाइव दिख रहा है।' 
                      : 'सर्राफा भाव टिकर वेबसाइट से बंद कर दिया गया है (पाठकों को नहीं दिखेगा)।'
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isTogglingBullion}
                onClick={handleToggleBullionKillSwitch}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-hindi transition shadow-sm flex items-center gap-2 shrink-0 active:scale-95 ${
                  bullionEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isTogglingBullion ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <PowerOff className="w-4 h-4" />
                )}
                <span>{bullionEnabled ? 'सर्राफा पैनल बंद करें (Turn OFF)' : 'सर्राफा पैनल चालू करें (Turn ON)'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 dark:border-gray-800 gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <span>🪙 ब्यावर स्थानीय बाजार</span>
                </div>
                <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                  🪙 ब्यावर सर्राफा भाव प्रबंधन (Bullion Rates)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  आज के स्थानीय सोने व चांदी के भाव यहाँ अपडेट करें। यह सीधे वेबसाइट के शीर्ष टिकर पर अपडेटेड समय के साथ प्रदर्शित होगा।
                </p>
              </div>

              {bullionLastUpdated && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-2 rounded-2xl text-xs text-amber-800 dark:text-amber-300 font-mono flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>अंतिम अपडेट: {new Date(bullionLastUpdated).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveBullionRates} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bullionRates.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold font-hindi text-gray-900 dark:text-white">
                        {item.item}
                      </h4>
                      <span className="text-xs text-gray-400 font-hindi">
                        इकाई: {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-sm font-bold text-gray-500">₹</span>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => handleBullionPriceChange(item.id, e.target.value)}
                        placeholder="Ex: 78500"
                        className="w-28 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm font-mono font-black text-amber-600 dark:text-amber-400 text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isBullionSaving}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{isBullionSaving ? 'सेव हो रहा है...' : '💾 आज के भाव सेव व अपडेट करें'}</span>
                </button>
              </div>
            </form>
          </div>
        )}



        {/* ==================================================== */}
        {/* 4. ANALYTICS PAGE */}
        {/* ==================================================== */}
        {activeTab === 'analytics' && (() => {
          const totalArticles = beawarArticles.length;
          const totalViews = beawarArticles.reduce((sum, a) => sum + (a.views || 0), 0);
          const topArticles = [...beawarArticles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

          return (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                  📊 वेबसाइट एनालिटिक्स (Website Analytics)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  यहाँ आप देख सकते हैं कि आपकी वेबसाइट पर कितनी खबरें अपलोड हुई हैं और उन्हें कितने लोगों ने पढ़ा है।
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-500 mb-1">{totalArticles}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">कुल खबरें (Total Articles)</span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500 mb-1">{totalViews}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">कुल व्यूज (Total Views)</span>
                </div>
              </div>

              {/* Top Articles List */}
              <div className="pt-4">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-l-4 border-red-500 pl-2">
                  🔥 टॉप 5 सबसे ज्यादा पढ़ी गई खबरें (Top 5 Most Read)
                </h4>
                <div className="space-y-3">
                  {topArticles.map((art, idx) => (
                    <div key={art.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                          {art.titleHi}
                        </span>
                      </div>
                      <div className="flex-shrink-0 ml-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded font-bold text-xs whitespace-nowrap">
                        👁️ {art.views || 0}
                      </div>
                    </div>
                  ))}
                  {topArticles.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">अभी कोई डेटा नहीं है।</p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}


      
        {/* ==================================================== */}
        {/* 5. ADVERTISEMENT MANAGER */}
        {/* ==================================================== */}
        {activeTab === 'ads' && (
          <div className="space-y-8">
            {/* Create New Ad Form */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Megaphone className="w-4 h-4" />
                  <span>लोकल एडवरटाइजिंग इंजन</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                      {editingAd ? '✏️ विज्ञापन संपादित करें (Edit Advertisement)' : '📢 नया विज्ञापन जोड़ें (Create Advertisement)'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {editingAd 
                        ? 'विज्ञापन की जानकारी, मीडिया अथवा एक्शन बटन अपडेट करें।' 
                        : 'ब्यावर व स्थानीय व्यापारियों के विज्ञापन यहाँ से सीधे वेबसाइट पर शेड्यूल और पब्लिश करें।'}
                    </p>
                  </div>
                  {editingAd && (
                    <button
                      type="button"
                      onClick={handleCancelEditAd}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition font-hindi"
                    >
                      रद्द करें (Cancel)
                    </button>
                  )}
                </div>
              </div>

              {editingAd && (
                <div className="mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <Edit3 className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold font-hindi block">
                        विज्ञापन संपादन मोड (Editing Mode Active)
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-300">
                        आप <strong>&quot;{editingAd.businessName}&quot;</strong> के विज्ञापन में बदलाव कर रहे हैं।
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEditAd}
                    className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 shadow-sm"
                  >
                    नया विज्ञापन बनाएं
                  </button>
                </div>
              )}

              <form onSubmit={handleSaveAd} className="space-y-5">
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 font-hindi">
                    कंपनी / व्यापार का नाम (Business Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={adBusinessName}
                    onChange={e => setAdBusinessName(e.target.value)}
                    placeholder="उदा: श्री गणेश ज्वेलर्स (ब्यावर)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-hindi"
                  />
                </div>

                {/* Display Style Choice (A4 Poster / Flyer vs Compact Card) */}
                <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1 font-hindi">
                    🎨 विज्ञापन डिस्प्ले स्टाइल (Display Format) *
                  </label>
                  <p className="text-[11px] text-gray-500 mb-3">
                    A4 साइज़ पैम्फलेट, लीफलेट व पोस्टर्स बिना कटे पूरे दिखाने के लिए फुल पोस्टर मोड चुनें:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-start gap-2.5 p-3.5 rounded-xl border cursor-pointer transition ${
                      adDisplayStyle === 'poster'
                        ? 'bg-red-50/70 dark:bg-red-950/30 border-red-500 text-red-950 dark:text-red-200'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="adDisplayStyle"
                        value="poster"
                        checked={adDisplayStyle === 'poster'}
                        onChange={() => setAdDisplayStyle('poster')}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold font-hindi block">
                          📄 फुल A4 पोस्टर / पैम्फलेट (Full Poster / Flyer) - अनुशंसित
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 block">
                          पूरा विज्ञापन बिना कटे ओरिजिनल अनुपात में दिखेगा।
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-2.5 p-3.5 rounded-xl border cursor-pointer transition ${
                      adDisplayStyle === 'compact'
                        ? 'bg-red-50/70 dark:bg-red-950/30 border-red-500 text-red-950 dark:text-red-200'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="adDisplayStyle"
                        value="compact"
                        checked={adDisplayStyle === 'compact'}
                        onChange={() => setAdDisplayStyle('compact')}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold font-hindi block">
                          📰 कॉम्पैक्ट कार्ड (Compact Card)
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 block">
                          टेक्स्ट विवरण और छोटे थंबनेल के साथ।
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Placement Multi-Select Checkboxes */}
                <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1 font-hindi">
                    📍 विज्ञापन स्थान चुनें (Placement - बहुविकल्पीय) *
                  </label>
                  <p className="text-[11px] text-gray-500 mb-3">
                    आप एक साथ कई स्थान चुन सकते हैं जहां यह विज्ञापन दिखेगा:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi hover:border-red-500 transition">
                      <input
                        type="checkbox"
                        checked={adPlacementBanner}
                        onChange={e => setAdPlacementBanner(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                      <span>🔝 मुख्य समाचार ब्लॉक के ठीक नीचे (Main News Banner)</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi hover:border-red-500 transition">
                      <input
                        type="checkbox"
                        checked={adPlacementFeed}
                        onChange={e => setAdPlacementFeed(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                      <span>📰 खबरों के बीच (In-Feed)</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi hover:border-red-500 transition">
                      <input
                        type="checkbox"
                        checked={adPlacementArticle}
                        onChange={e => setAdPlacementArticle(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                      <span>📖 खबर के अंदर (Inside News Article)</span>
                    </label>
                  </div>
                </div>

                {/* About / Offer */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 font-hindi">
                    विज्ञापन विवरण / स्पेशल ऑफर (About / Offer Tagline)
                  </label>
                  <textarea
                    rows={2}
                    value={adAbout}
                    onChange={e => setAdAbout(e.target.value)}
                    placeholder="उदा: 916 हॉलमार्क सोने के आभूषणों के विशेष संग्रह पर मेकिंग चार्ज में 50% की विशेष छूट! आज ही पधारें।"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-hindi"
                  />
                </div>

                {/* MULTIPLE CALL TO ACTION BUTTONS SELECTOR */}
                <div className="bg-gray-50 dark:bg-gray-850 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1 font-hindi">
                      🎯 कॉल-टू-एक्शन बटन चुनें (Action Buttons - बहुविकल्पीय) *
                    </label>
                    <p className="text-[11px] text-gray-500">
                      जो बटन आप विज्ञापन पर दिखाना चाहते हैं, उस पर टिक करें और उसका नंबर या लिंक भरें:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. WhatsApp Button */}
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi">
                        <input
                          type="checkbox"
                          checked={adEnableWhatsApp}
                          onChange={e => setAdEnableWhatsApp(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>💬 व्हाट्सएप चैट (WhatsApp Direct)</span>
                      </label>
                      {adEnableWhatsApp && (
                        <input
                          type="text"
                          value={adWhatsAppNumber}
                          onChange={e => setAdWhatsAppNumber(e.target.value)}
                          placeholder="व्हाट्सएप नंबर (10 अंक, उदा: 9887500875)"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                        />
                      )}
                    </div>

                    {/* 2. Direct Call Button */}
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi">
                        <input
                          type="checkbox"
                          checked={adEnableCall}
                          onChange={e => setAdEnableCall(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>📞 सीधा फोन कॉल (Direct Phone Call)</span>
                      </label>
                      {adEnableCall && (
                        <input
                          type="text"
                          value={adCallNumber}
                          onChange={e => setAdCallNumber(e.target.value)}
                          placeholder="कॉलिंग नंबर (उदा: 9887500875)"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                        />
                      )}
                    </div>

                    {/* 3. Google Maps Location */}
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi">
                        <input
                          type="checkbox"
                          checked={adEnableMaps}
                          onChange={e => setAdEnableMaps(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>📍 गूगल मैप्स लोकेशन (Google Maps Location)</span>
                      </label>
                      {adEnableMaps && (
                        <input
                          type="text"
                          value={adMapsUrl}
                          onChange={e => setAdMapsUrl(e.target.value)}
                          placeholder="मैप्स लिंक या दुकान का पता (उदा: https://maps.app...)"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                        />
                      )}
                    </div>

                    {/* 4. Website URL */}
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200 font-hindi">
                        <input
                          type="checkbox"
                          checked={adEnableWebsite}
                          onChange={e => setAdEnableWebsite(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>🌐 वेबसाइट लिंक (Website Link)</span>
                      </label>
                      {adEnableWebsite && (
                        <input
                          type="text"
                          value={adWebsiteUrl}
                          onChange={e => setAdWebsiteUrl(e.target.value)}
                          placeholder="वेबसाइट URL (उदा: https://example.com)"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Duration / Timer */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 font-hindi">
                      अवधि / टाइमर (Duration Timer) *
                    </label>
                    <select
                      value={adDuration}
                      onChange={e => setAdDuration(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-hindi"
                    >
                      <option value="7d">📅 1 सप्ताह (1 Week - Recommended)</option>
                      <option value="30d">📅 1 महीना (1 Month)</option>
                      <option value="24h">⏱️ 24 घंटे (24 Hours)</option>
                      <option value="48h">⏱️ 48 घंटे (48 Hours)</option>
                      <option value="permanent">♾️ जब तक मैं बंद न करूँ (Until I Close)</option>
                      <option value="custom">⚙️ कस्टम दिन (Custom Days)</option>
                    </select>
                  </div>

                  {/* Custom Days Input only if selected */}
                  {adDuration === 'custom' ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 font-hindi">
                        कितने दिनों के लिए? (Days) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={adCustomDays}
                        onChange={e => setAdCustomDays(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Media Upload (Photo / Video to Cloudinary) */}
                <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 font-hindi">
                    🖼️ विज्ञापन फोटो अथवा वीडियो अपलोड करें (Cloudinary Cloud Storage - Max 50MB)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                      onChange={handleAdMediaUpload}
                      disabled={isAdMediaUploading}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer cursor-pointer"
                    />
                    {isAdMediaUploading && (
                      <span className="text-xs font-bold text-amber-600 animate-pulse">
                        ⏳ मीडिया क्लाउडिनरी पर अपलोड हो रही है...
                      </span>
                    )}
                    {adMediaUrl && (
                      <span className="text-xs font-bold text-emerald-600">
                        ✅ मीडिया सफलतापूर्वक अपलोड हो चुकी है!
                      </span>
                    )}
                  </div>
                  {adMediaUrl && (
                    <div className="mt-3 w-32 h-20 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-black">
                      {adMediaType === 'video' ? (
                        <video src={adMediaUrl} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={adMediaUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isAdSubmitting || isAdMediaUploading}
                    className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>
                      {isAdSubmitting 
                        ? (editingAd ? 'विज्ञापन अपडेट हो रहा है...' : 'विज्ञापन प्रकाशित हो रहा है...') 
                        : (editingAd ? '💾 बदलाव सुरक्षित करें (Update Ad)' : '🚀 विज्ञापन लाइव प्रकाशित करें')}
                    </span>
                  </button>
                  {editingAd && (
                    <button
                      type="button"
                      onClick={handleCancelEditAd}
                      className="px-5 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-sm rounded-xl transition font-hindi"
                    >
                      रद्द करें (Cancel)
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Manage Running Advertisements List */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                  📋 सभी विज्ञापनों की सूची ({adsList.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  यहाँ आप सभी सक्रिय, छिपे हुए और समय समाप्त विज्ञापनों का प्रदर्शन व स्थिति नियंत्रित कर सकते हैं।
                </p>
              </div>

              <div className="space-y-4">
                {adsList.map(ad => (
                  <div
                    key={ad.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      ad.isExpired
                        ? 'bg-gray-50 dark:bg-gray-850/40 border-gray-200 dark:border-gray-800 opacity-60'
                        : ad.isHidden
                        ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40'
                        : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {ad.mediaUrl ? (
                        ad.mediaType === 'video' ? (
                          <video src={ad.mediaUrl} className="w-20 h-16 rounded-xl object-cover shrink-0 border" muted />
                        ) : (
                          <img src={ad.mediaUrl} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0 border" />
                        )
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0">
                          📢
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">
                            विज्ञापन
                          </span>
                          {ad.isExpired ? (
                            <span className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              ⚠️ समय समाप्त (Expired)
                            </span>
                          ) : ad.isHidden ? (
                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              🔒 छिपा हुआ (Hidden)
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              🟢 लाइव सक्रिय (Active)
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-mono">
                            स्थान: {(ad.placements && ad.placements.length > 0 ? ad.placements : (ad.placement ? (ad.placement === 'all' ? ['banner', 'feed', 'article'] : ad.placement.split(',')) : ['banner', 'feed', 'article'])).map(p => 
                              p === 'banner' ? 'मुख्य बैनर' : p === 'feed' ? 'इन-फीड' : p === 'article' ? 'खबर के अंदर' : p
                            ).join(', ')}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold font-hindi text-gray-900 dark:text-white truncate">
                          {ad.businessName}
                        </h4>
                        {ad.about && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-hindi">
                            {ad.about}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>🎯 बटन:</span>
                            {(ad.actions && ad.actions.length > 0 ? ad.actions : (ad.actionType ? [{ type: ad.actionType, target: ad.actionTarget }] : [])).map((act, i) => (
                              <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-mono text-[10px] border border-gray-200 dark:border-gray-700">
                                {act.type}: {act.target}
                              </span>
                            ))}
                          </div>
                          <span>👁️ <strong>{ad.views || 0}</strong> बार देखा</span>
                          <span>🖱️ <strong>{ad.clicks || 0}</strong> बार क्लिक</span>
                          {ad.expiresAt && ad.expiresAt !== 'permanent' && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              ⏳ एक्सपायरी: {new Date(ad.expiresAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => handleStartEditAd(ad)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
                        title="संपादित करें (Edit)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>एडिट</span>
                      </button>

                      <button
                        onClick={() => handleToggleAdVisibility(ad)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          ad.isHidden
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {ad.isHidden ? '👁️ शो करें (Show)' : '🔒 हाइड करें (Hide)'}
                      </button>

                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {adsList.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-hindi">अभी कोई विज्ञापन नहीं जोड़ा गया है।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}



