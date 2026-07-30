/**
 * Hybrid English to Hindi Phonetic Transliteration Engine
 * Converts English text to Hindi script instantly client-side with offline phonetic rules + API fallback.
 */

// Common Dictionary Mappings for Quick Lookup
const dictMap: Record<string, string> = {
  // Common Surnames & Names
  'sharma': 'शर्मा',
  'gupta': 'गुप्ता',
  'kumar': 'कुमार',
  'singh': 'सिंह',
  'verma': 'वर्मा',
  'yadav': 'यादव',
  'jain': 'जैन',
  'agrawal': 'अग्रवाल',
  'agarwal': 'अग्रवाल',
  'meena': 'मीना',
  'mishra': 'मिश्रा',
  'shukla': 'शुक्ला',
  'tiwari': 'तिवारी',
  'joshi': 'जोशी',
  'patel': 'पटेल',
  'shah': 'शाह',
  'ramesh': 'रमेश',
  'suresh': 'सुरेश',
  'rajesh': 'राजेश',
  'dinesh': 'दिनेश',
  'naresh': 'नरेश',
  'mahesh': 'महेश',
  'mukesh': 'मुकेश',
  'amit': 'अमित',
  'sumit': 'सुमित',
  'vikram': 'विक्रम',
  'vikas': 'विकास',
  'rahul': 'राहुल',
  'rohit': 'रोहित',
  'vijay': 'विजय',
  'ajay': 'अजय',
  'sanjay': 'संजय',
  'sunil': 'सुनील',
  'anil': 'अनिल',
  'raju': 'राजू',
  'deepak': 'दीपक',
  'pankaj': 'पंकज',
  'manoj': 'मनोज',
  'vinod': 'विनोद',
  'ashok': 'अशोक',
  'sitaram': 'सीताराम',
  'radhey': 'राधे',
  'ji': 'जी',
  'shri': 'श्री',
  'smt': 'श्रीमती',
  'dr': 'डॉक्टर',

  // Address Terms
  'house': 'हाउस',
  'makan': 'मकान',
  'no': 'नंबर',
  'num': 'नंबर',
  'sector': 'सेक्टर',
  'gali': 'गली',
  'road': 'रोड',
  'street': 'स्ट्रीट',
  'colony': 'कॉलोनी',
  'nagar': 'नगर',
  'pur': 'पुर',
  'purbi': 'पूर्वी',
  'paschim': 'पश्चिम',
  'uttar': 'उत्तर',
  'dakshin': 'दक्षिण',
  'market': 'मार्केट',
  'bazar': 'बाज़ार',
  'bazaar': 'बाज़ार',
  'shop': 'दुकान',
  'store': 'स्टोर',
  'medical': 'मेडिकल',
  'traders': 'ट्रेडर्स',
  'agency': 'एजेंसी',
  'news': 'न्यूज़',
  'civil': 'सिविल',
  'lines': 'लाइंस',
  'station': 'स्टेशन',
  'railway': 'रेलवे',
  'near': 'पास',
  'opposite': 'सामने',
  'main': 'मुख्य',
  'gate': 'गेट',
  'block': 'ब्लॉक',
  'flat': 'फ्लैट',
  'plot': 'प्लॉट',
  'quarter': 'क्वार्टर',
  'kuti': 'कुटीर',
  'bhawan': 'भवन'
};

// Consonant & Vowel Phonetic Mapping
const vowels: Record<string, string> = {
  'aa': 'ा', 'ai': 'ै', 'au': 'ौ', 'a': '', 'e': 'े', 'i': 'ि', 'ee': 'ी', 'o': 'ो', 'u': 'ु', 'oo': 'ू'
};

const indepVowels: Record<string, string> = {
  'aa': 'आ', 'ai': 'ऐ', 'au': 'औ', 'a': 'अ', 'e': 'ए', 'i': 'इ', 'ee': 'ई', 'o': 'ओ', 'u': 'उ', 'oo': 'ऊ'
};

const consonants: Record<string, string> = {
  'ksh': 'क्ष', 'gy': 'ज्ञ', 'tr': 'त्र',
  'kh': 'ख', 'gh': 'घ', 'ch': 'च', 'chh': 'छ', 'jh': 'झ',
  'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ', 'sh': 'श',
  'k': 'क', 'g': 'ग', 'c': 'क', 't': 'त', 'd': 'द',
  'n': 'न', 'p': 'प', 'b': 'ब', 'm': 'म', 'y': 'य',
  'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व', 's': 'स',
  'h': 'ह', 'z': 'ज़', 'f': 'फ़', 'x': 'क्स'
};

function wordPhoneticToHindi(word: string): string {
  const lower = word.toLowerCase().trim();
  if (!lower) return '';

  // 1. Direct dictionary match
  if (dictMap[lower]) {
    return dictMap[lower];
  }

  // 2. Numbers or non-alphabetic
  if (/^\d+$/.test(word)) {
    return word;
  }

  // 3. Fallback character-by-character rule
  let result = '';
  let i = 0;
  const len = word.length;

  while (i < len) {
    const ch = word[i].toLowerCase();
    
    // Check 3-char consonants
    if (i + 2 < len && consonants[word.substring(i, i + 3).toLowerCase()]) {
      result += consonants[word.substring(i, i + 3).toLowerCase()];
      i += 3;
    }
    // Check 2-char consonants
    else if (i + 1 < len && consonants[word.substring(i, i + 2).toLowerCase()]) {
      result += consonants[word.substring(i, i + 2).toLowerCase()];
      i += 2;
    }
    // Check 1-char consonant
    else if (consonants[ch]) {
      result += consonants[ch];
      i++;
    }
    // Vowels
    else if (vowels[ch] !== undefined) {
      if (i === 0) {
        result += indepVowels[ch] || ch;
      } else {
        result += vowels[ch];
      }
      i++;
    }
    else {
      result += ch;
      i++;
    }
  }

  return result;
}

export function transliterateToHindi(text: string): string {
  if (!text) return '';

  // Split by spaces / punctuation and convert word by word
  const words = text.split(/(\s+|[.,\-/])/);
  return words.map(w => {
    if (/\s+|[.,\-/]/.test(w)) return w;
    return wordPhoneticToHindi(w);
  }).join('');
}
