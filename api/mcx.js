// api/mcx.js
// This serverless function fetches live MCX data.
// Note: Official MCX data requires a paid API key (e.g., Zerodha Kite Connect, TrueData, etc.)
// We return simulated/cached data for the frontend to render the carousel automatically.

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // TODO: In the future, replace this with an actual fetch to your broker's API
    // const response = await fetch('https://api.yourbroker.com/mcx', { headers: { 'Authorization': 'Bearer YOUR_KEY' }});
    // const data = await response.json();

    // Simulated Real-time Data
    const mcxData = [
      { symbol: 'GOLD', date: '04DEC2026', price: '76450.00', change: '+0.15%' },
      { symbol: 'SILVER', date: '30NOV2026', price: '91200.00', change: '-0.09%' },
      { symbol: 'COPPER', date: '30OCT2026', price: '854.20', change: '-0.05%' },
      { symbol: 'ZINC', date: '30OCT2026', price: '280.45', change: '+1.20%' },
      { symbol: 'CRUDEOIL', date: '19NOV2026', price: '6450.00', change: '-1.50%' },
      { symbol: 'NATURALGAS', date: '25OCT2026', price: '240.10', change: '+0.80%' },
      { symbol: 'LEAD', date: '30OCT2026', price: '192.05', change: '-0.10%' },
      { symbol: 'ALUMINIUM', date: '30OCT2026', price: '245.60', change: '+0.25%' },
    ];

    res.status(200).json({ success: true, timestamp: new Date().toISOString(), data: mcxData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch MCX data' });
  }
}
