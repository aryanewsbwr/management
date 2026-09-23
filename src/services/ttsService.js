// Text-to-Speech Audio News Reader in Hindi/English

class TextToSpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.currentArticleId = null;
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb({
      isPlaying: this.isPlaying,
      articleId: this.currentArticleId
    }));
  }

  speak(text, articleId, lang = 'hi') {
    if (!this.synth) {
      alert('आपके ब्राउज़र में ऑडियो वाचन समर्थित नहीं है।');
      return;
    }

    // If currently speaking this same article, toggle pause/resume
    if (this.currentArticleId === articleId && this.synth.speaking) {
      if (this.isPlaying) {
        this.synth.pause();
        this.isPlaying = false;
        this.notify();
        return;
      } else {
        this.synth.resume();
        this.isPlaying = true;
        this.notify();
        return;
      }
    }

    // Stop existing speech
    this.stop();

    // Clean text from HTML/markdown
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/https?:\/\/\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clarity in news reporting
    utterance.pitch = 1.0;

    // Try finding a natural Hindi voice
    const voices = this.synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (hindiVoice && lang === 'hi') {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.currentArticleId = articleId;
      this.notify();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.currentArticleId = null;
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      this.isPlaying = false;
      this.currentArticleId = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.currentArticleId = null;
    this.notify();
  }
}

export const ttsService = new TextToSpeechService();
