const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');
c = c.replace(
  'className="w-full max-h-56 object-contain mx-auto"',
  'className="w-full max-h-56 object-contain mx-auto" /> <button type="button" onClick={handleCaptureThumbnail} className="absolute bottom-10 right-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition z-10">Capture Frame as Thumbnail</button>'
);
c = c.replace(
  'src={videoPreviewUrl}',
  'ref={videoRef} crossOrigin="anonymous" src={videoPreviewUrl}'
);
fs.writeFileSync('src/pages/AdminPanel.jsx', c);
