// Live News Service for Aryan News Agency
// Calls Vercel Serverless Edge Function /api/news with 10-15 minute CDN caching

export async function fetchAllLiveCategories() {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) {
      throw new Error(`Failed to fetch /api/news: ${res.status}`);
    }

    const data = await res.json();
    if (data && Array.isArray(data.articles)) {
      return data.articles;
    }
    return [];
  } catch (err) {
    console.warn('[newsApi] Error fetching /api/news:', err.message);
    return [];
  }
}
