const fs = require('fs');
let c = fs.readFileSync('src/components/WebStories.jsx', 'utf8');
c = c.replace(
  "image: a.image || (a.videoUrl && a.videoUrl.includes('cloudinary.com') ? a.videoUrl.replace(/\\\\.(mp4|webm|mov|mkv)\\$/i, '.jpg') : 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80')",
  "image: (a.image && !a.image.includes('unsplash.com')) ? a.image : (a.videoUrl && a.videoUrl.includes('cloudinary.com') ? a.videoUrl.replace(/\\\\.(mp4|webm|mov|mkv)\\$/i, '.jpg') : 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80')"
);
fs.writeFileSync('src/components/WebStories.jsx', c);
