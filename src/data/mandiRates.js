export const INITIAL_MANDI_RATES = [
  { id: 'm1', cropHi: 'सफेद तिल (तिलपत्ती ग्रेड)', cropEn: 'White Sesame', minPrice: 12200, maxPrice: 13800, unit: '₹/क्विंटल', trend: 'up', change: '+₹150' },
  { id: 'm2', cropHi: 'देशी सौंफ (सुपर ग्रीन)', cropEn: 'Fennel Seeds', minPrice: 10400, maxPrice: 15200, unit: '₹/क्विंटल', trend: 'up', change: '+₹220' },
  { id: 'm3', cropHi: 'जीरा मशीन क्लीन', cropEn: 'Cumin (Jeera)', minPrice: 24500, maxPrice: 28900, unit: '₹/क्विंटल', trend: 'down', change: '-₹180' },
  { id: 'm4', cropHi: 'गेहूं (टुकड़ी उत्तम)', cropEn: 'Wheat', minPrice: 2600, maxPrice: 2850, unit: '₹/क्विंटल', trend: 'stable', change: 'स्थिर' },
  { id: 'm5', cropHi: 'सरसों 42% तेल', cropEn: 'Mustard Seeds', minPrice: 5200, maxPrice: 5750, unit: '₹/क्विंटल', trend: 'up', change: '+₹80' },
  { id: 'm6', cropHi: 'चना देशी', cropEn: 'Gram / Chana', minPrice: 5900, maxPrice: 6350, unit: '₹/क्विंटल', trend: 'stable', change: 'स्थिर' },
  { id: 'm7', cropHi: 'कपास (नरमा)', cropEn: 'Cotton', minPrice: 6900, maxPrice: 7550, unit: '₹/क्विंटल', trend: 'up', change: '+₹110' },
  { id: 'm8', cropHi: 'ज्वार / बाजरा', cropEn: 'Millet', minPrice: 2150, maxPrice: 2400, unit: '₹/क्विंटल', trend: 'stable', change: 'स्थिर' }
];

export const MANDI_NOTICE = {
  date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  marketName: 'कृषि उपज मंडी समिति ब्यावर (जिला ब्यावर)',
  status: 'मंडी खुली है | आवक मध्यम'
};
