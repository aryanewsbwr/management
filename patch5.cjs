const fs = require('fs');
let c = fs.readFileSync('src/services/storage.js', 'utf8');
c = c.replace('const { content: cleanContentHi, gallery, videoUrl, mediaType, mediaCaption } = extractMediaMeta(item.content_hi, item);', 'const { content: cleanContentHi, gallery, videoUrl, mediaType, mediaCaption, isHidden } = extractMediaMeta(item.content_hi, item);');
fs.writeFileSync('src/services/storage.js', c);
