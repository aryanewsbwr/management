const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');
c = c.replace('className="w-full max-h-56 object-contain mx-auto" /> <button', 'className="w-full max-h-56 object-contain mx-auto" />\n                          <button');
c = c.replace('Capture Frame as Thumbnail</button>\n                          />\n                          <button', 'Capture Frame as Thumbnail</button>\n                          <button');
fs.writeFileSync('src/pages/AdminPanel.jsx', c);
