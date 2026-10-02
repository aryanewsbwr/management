// api/mcx.js
// Serverless function for Multi-Commodity Exchange (Futures, Spot, Index)

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
    const data = {
      futures: [
        { symbol: 'GOLD', date: '04DEC2026', price: '76450.00', change: '+0.15%' },
        { symbol: 'SILVER', date: '30NOV2026', price: '91200.00', change: '-0.09%' },
        { symbol: 'COPPER', date: '30OCT2026', price: '854.20', change: '-0.05%' },
        { symbol: 'ZINC', date: '30OCT2026', price: '280.45', change: '+1.20%' },
        { symbol: 'CRUDEOIL', date: '19NOV2026', price: '6450.00', change: '-1.50%' },
        { symbol: 'NATURALGAS', date: '25OCT2026', price: '240.10', change: '+0.80%' },
        { symbol: 'LEAD', date: '30OCT2026', price: '192.05', change: '-0.10%' },
        { symbol: 'ALUMINIUM', date: '30OCT2026', price: '245.60', change: '+0.25%' },
      ],
      spot: [
        { symbol: 'GOLD 24K (10g)', date: 'SPOT', price: '78250.00', change: '+0.20%' },
        { symbol: 'GOLD 22K (10g)', date: 'SPOT', price: '71750.00', change: '+0.18%' },
        { symbol: 'GOLD 18K (10g)', date: 'SPOT', price: '58700.00', change: '+0.15%' },
        { symbol: 'SILVER 999 (1kg)', date: 'SPOT', price: '93500.00', change: '-0.12%' },
        { symbol: 'SILVER (100g)', date: 'SPOT', price: '9350.00', change: '-0.12%' },
        { symbol: 'PLATINUM (10g)', date: 'SPOT', price: '29800.00', change: '+0.05%' },
      ],
      index: [
        { symbol: 'MCX BULLDEX', date: 'FUT', price: '18420.50', change: '+0.10%' },
        { symbol: 'MCX METLDEX', date: 'FUT', price: '22890.00', change: '-0.25%' },
        { symbol: 'MCX ENRGDEX', date: 'FUT', price: '5610.00', change: '+0.45%' },
      ]
    };

    res.status(200).json({ 
      success: true, 
      timestamp: new Date().toISOString(), 
      data 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch MCX data' });
  }
}
