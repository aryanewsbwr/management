// Text-to-Speech Audio News Reader in Hindi/English with Sentence-Queue Chunking

class TextToSpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentArticleId = null;
    this.subscribers = new Set();
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    this.keepAliveTimer = null;
    this.cachedVoices = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb({
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      articleId: this.currentArticleId
    }));
  }

  // Split long news into natural, clean chunks (100-160 chars) to prevent Chrome truncation
  splitIntoChunks(text) {
    let clean = text
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[#*_~`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return [];

    // Split on sentence boundaries (Purna Viram '।', Pipe '|', Period '.', Exclamation '!', Question '?', Newlines)
    const rawSentences = clean.split(/([।|!?.?\n]+)/);
    const sentences = [];
    
    for (let i = 0; i < rawSentences.length; i += 2) {
      const sentenceText = rawSentences[i] ? rawSentences[i].trim() : '';
      const punctuation = rawSentences[i + 1] ? rawSentences[i + 1].trim() : '';
      if (sentenceText) {
        sentences.push(`${sentenceText}${punctuation ? ' ' + punctuation : '।'}`);
      }
    }

    // Further break any long sentences (> 150 chars) by commas or phrases so audio flows naturally
    const chunks = [];
    for (const s of sentences) {
      if (s.length <= 150) {
        chunks.push(s);
      } else {
        const subParts = s.split(/([,;:\-–]+)/);
        let temp = '';
        for (let j = 0; j < subParts.length; j++) {
          if ((temp + subParts[j]).length > 150 && temp.trim().length > 0) {
            chunks.push(temp.trim());
            temp = subParts[j];
          } else {
            temp += subParts[j];
          }
        }
        if (temp.trim().length > 0) {
          chunks.push(temp.trim());
        }
      }
    }

    return chunks.filter(c => c.length > 0);
  }

  getBestVoice(lang = 'hi') {
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : (this.synth?.getVoices() || []);
    if (!voices || voices.length === 0) return null;

    if (lang === 'hi') {
      // 1. Look for high-quality Indian Hindi voices (Google, Microsoft, Lekha, Swara, Hemant)
      const hindiVoices = voices.filter(v => 
        v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in'))
      );

      if (hindiVoices.length > 0) {
        const naturalVoice = hindiVoices.find(v => 
          /google|natural|microsoft|swara|hemant|kalpana/i.test(v.name)
        );
        return naturalVoice || hindiVoices[0];
      }

      // Fallback: check if voice name contains 'Hindi' or 'India'
      const nameMatch = voices.find(v => /hindi|india/i.test(v.name));
      if (nameMatch) return nameMatch;
    } else {
      // English (Indian accent preferred)
      const enIn = voices.find(v => v.lang && v.lang.toLowerCase() === 'en-in');
      if (enIn) return enIn;
      const enOther = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      if (enOther) return enOther;
    }

    return null;
  }

  speak(text, articleId, lang = 'hi') {
    if (!this.synth) {
      alert('आपके ब्राउज़र में ऑडियो वाचन समर्थित नहीं है।');
      return;
    }

    // Toggle Pause / Resume if already playing this same article
    if (this.currentArticleId === articleId && this.synth.speaking) {
      if (this.isPlaying && !this.isPaused) {
        this.synth.pause();
        this.isPlaying = false;
        this.isPaused = true;
        this.notify();
        return;
      } else if (this.isPaused) {
        this.synth.resume();
        this.isPlaying = true;
        this.isPaused = false;
        this.notify();
        return;
      }
    }

    // Stop whatever was playing
    this.stop();

    const chunks = this.splitIntoChunks(text);
    if (chunks.length === 0) return;

    this.chunkQueue = chunks;
    this.currentChunkIndex = 0;
    this.currentArticleId = articleId;
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();

    // Start Chrome keep-alive timer
    this.startKeepAlive();

    // Play first chunk
    this.playNextChunk(lang);
  }

  playNextChunk(lang = 'hi') {
    if (!this.isPlaying || this.currentChunkIndex >= this.chunkQueue.length) {
      this.stop();
      return;
    }

    const chunkText = this.chunkQueue[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Optimal news anchor pace
    utterance.pitch = 1.0;

    const voice = this.getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (this.isPlaying) {
        this.currentChunkIndex++;
        this.playNextChunk(lang);
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      console.warn('[TTS] Utterance notice on chunk:', e);
      if (this.isPlaying && this.currentChunkIndex < this.chunkQueue.length - 1) {
        this.currentChunkIndex++;
        this.playNextChunk(lang);
      } else {
        this.stop();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  startKeepAlive() {
    this.clearKeepAlive();
    // Prevents Chromium / Safari from timing out speech after 14 seconds
    this.keepAliveTimer = setInterval(() => {
      if (this.isPlaying && this.synth && this.synth.speaking && !this.isPaused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  }

  clearKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  stop() {
    this.clearKeepAlive();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentArticleId = null;
    this.currentUtterance = null;
    this.notify();
  }
}

export const ttsService = new TextToSpeechService();
