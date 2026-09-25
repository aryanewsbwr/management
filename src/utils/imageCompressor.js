/**
 * Aryan News Agency - High Quality Client-Side Image Optimizer
 * Converts large camera uploads (3MB - 15MB) into lightweight, web-optimized 
 * JPEG/WebP files (~40KB - 90KB) with crisp quality and perfect aspect ratio.
 */

export async function compressImage(file, maxWidth = 1200, maxHeight = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('कोई फ़ाइल प्राप्त नहीं हुई।'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('अमान्य फ़ाइल प्रकार। कृपया केवल इमेज (JPG, PNG, WebP) चुनें।'));
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down proportionally if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('कैनवास संदर्भ प्राप्त करने में विफल।'));
        }

        // White background to avoid transparent black artifacts when converting PNG to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Base64 Data URL (can be saved directly in DB as 100% reliable fallback)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Blob for Supabase Storage bucket upload
        canvas.toBlob(
          (blob) => {
            resolve({
              dataUrl,
              blob: blob || file,
              width,
              height,
              sizeBytes: blob ? blob.size : file.size
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (imgErr) => {
        reject(new Error('इमेज को प्रोसेस करने में त्रुटि: ' + (imgErr?.message || 'अमान्य इमेज डाटा')));
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = (readErr) => {
      reject(new Error('फ़ाइल पढ़ने में त्रुटि: ' + (readErr?.message || 'फ़ाइल पढ़ी नहीं जा सकी')));
    };

    reader.readAsDataURL(file);
  });
}
