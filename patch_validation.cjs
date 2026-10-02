const fs = require('fs');
let c = fs.readFileSync('src/services/storage.js', 'utf8');

const validationLogic = \
  async uploadArticleMedia(file) {
    if (!file) throw new Error('No file provided');
    
    // Security: Client-side validation
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is too large. Maximum size is 50MB.');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file format. Only JPG, PNG, WEBP, GIF, MP4, WEBM, and MOV are allowed.');
    }
    
    const isVideo = file.type && file.type.startsWith('video/');\

c = c.replace(
  "  async uploadArticleMedia(file) {\n    const isVideo = file.type && file.type.startsWith('video/');",
  validationLogic
);

fs.writeFileSync('src/services/storage.js', c);
