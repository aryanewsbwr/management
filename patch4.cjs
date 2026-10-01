const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');
c = c.replace(
  '          } else {\n            finalVideoUrl = videoPreviewUrl;\n          }',
  '          } else {\n            finalVideoUrl = videoPreviewUrl;\n          }\n\n          if (finalVideoUrl && finalVideoUrl.includes("cloudinary.com") && (Number(videoTrimStart) > 0 || Number(videoTrimEnd) > 0)) {\n            let trimStr = "upload/";\n            if (Number(videoTrimStart) > 0) trimStr += "so_" + Number(videoTrimStart) + ",";\n            if (Number(videoTrimEnd) > 0) trimStr += "eo_" + Number(videoTrimEnd) + ",";\n            trimStr = trimStr.slice(0, -1) + "/";\n            finalVideoUrl = finalVideoUrl.replace("upload/", trimStr);\n          }'
);
fs.writeFileSync('src/pages/AdminPanel.jsx', c);
