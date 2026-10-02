const fs = require("fs");
let c = fs.readFileSync("api/share.js", "utf8");
const newBody = `
<body style="margin:0;padding:0;background:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;">
  <div style="text-align:center;animation:fadeIn 0.5s ease-in;">
    <div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top:3px solid #dc2626;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
    <div style="color:#b91c1c;font-weight:800;font-size:18px;letter-spacing:-0.5px;">Aryan News Agency</div>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
  </style>
</body>`;
c = c.replace(/<body[\s\S]*?<\/body>/, newBody.trim());
fs.writeFileSync("api/share.js", c);

