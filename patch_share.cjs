const fs = require('fs');
let c = fs.readFileSync('api/share.js', 'utf8');

const newBody = \
<body style="margin:0;padding:0;background:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;">
  <div style="text-align:center;">
    <div style="width:50px;height:50px;border:4px solid #f3f3f3;border-top:4px solid #dc2626;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
    <div style="color:#b91c1c;font-weight:700;font-size:18px;">Aryan News Agency</div>
    <div style="color:#666;font-size:13px;margin-top:4px;">Redirecting to article...</div>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</body>
\;

c = c.replace(/<body[\\s\\S]*?<\\/body>/, newBody.trim());
fs.writeFileSync('api/share.js', c);
