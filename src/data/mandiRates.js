// Aryan News Agency - Beawar Mandi Rates Configuration
// Note: Hardcoded placeholder rates have been removed.
// Rates are dynamically fetched from Supabase Database.

export const INITIAL_MANDI_RATES = [];

export const MANDI_NOTICE = {
  date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  marketName: 'कृषि उपज मंडी समिति ब्यावर (जिला ब्यावर)',
  status: 'मंडी खुली है | आवक मध्यम'
};
