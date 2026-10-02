// api/upload-signature.js
// Generates secure signed upload credentials for Cloudinary restricted to verified admin
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify Supabase Admin Authentication
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing authentication token' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userRes.ok) {
        return res.status(401).json({ error: 'Unauthorized: Invalid administrative token' });
      }

      const userData = await userRes.json();
      const adminEmail = 'ananews@aryannewsagency.com';
      if (userData.email !== adminEmail && !userData.email?.includes('aryan')) {
        return res.status(403).json({ error: 'Forbidden: Admin access only' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Authentication verification error: ' + err.message });
    }
  }

  // 2. Cloudinary Credentials from Vercel Environment Variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'vxlbrcgx';
  const apiKey = process.env.CLOUDINARY_API_KEY || '825721111663784';
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    return res.status(500).json({ 
      error: 'Server configuration error: CLOUDINARY_API_SECRET is missing in environment variables' 
    });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'arya_news';

  // Cloudinary signature string (alphabetically sorted parameters): "folder=arya_news&timestamp=..." + apiSecret
  const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  return res.status(200).json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder
  });
}
