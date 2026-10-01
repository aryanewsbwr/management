const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');

c = c.replace(
  '  // Video Poster / Cover Image Picker',
  \  const handleCaptureThumbnail = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setVideoPosterPreview(dataUrl);
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
      setVideoPosterFile(file);
    } catch(e) { console.error('Capture error:', e); }
  };

  // Video Poster / Cover Image Picker\
);

fs.writeFileSync('src/pages/AdminPanel.jsx', c);
