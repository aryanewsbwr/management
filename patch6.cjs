const fs = require('fs');
let c = fs.readFileSync('src/services/storage.js', 'utf8');
c = c.replace('const { content: cleanContentHi, gallery, videoUrl, mediaType, mediaCaption } = extractMediaMeta(data.content_hi, data);', 'const { content: cleanContentHi, gallery, videoUrl, mediaType, mediaCaption, isHidden } = extractMediaMeta(data.content_hi, data);');
fs.writeFileSync('src/services/storage.js', c);
