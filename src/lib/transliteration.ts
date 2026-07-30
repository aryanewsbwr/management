/**
 * Instant English to Hindi Transliteration Helper
 * Uses Google Input Tools API for auto-converting English phonetic text to Hindi.
 */
export async function transliterateToHindi(text: string): Promise<string> {
  if (!text || !text.trim()) return '';

  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i100-extension&num=1`;
    const res = await fetch(url);
    if (!res.ok) return text;
    
    const data = await res.json();
    if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
      return data[1][0][1][0] || text;
    }
  } catch (err) {
    // Fallback if API fails
  }
  return text;
}
