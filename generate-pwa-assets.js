const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// 1. Create 192x192 icon (SVG)
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#181c1d"/>
  <path d="M96 46L136 116H56L96 46Z" fill="#86d2e5"/>
  <path d="M96 146L56 76H136L96 146Z" fill="#78dc77" opacity="0.8"/>
</svg>`;

// 2. Create 512x512 icon (SVG)
const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#181c1d"/>
  <path d="M256 130L376 340H136L256 130Z" fill="#86d2e5"/>
  <path d="M256 380L136 170H376L256 380Z" fill="#78dc77" opacity="0.8"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), svg192);
fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), svg512);

console.log('SVG Icons generated successfully.');

// 3. Create manifest.json
const manifest = {
  name: "Zenith Keuangan Mapan",
  short_name: "Zenith",
  description: "Aplikasi pengelola keuangan dan pelaporan kekayaan kelas atas.",
  start_url: "/",
  display: "standalone",
  background_color: "#101415",
  theme_color: "#181c1d",
  icons: [
    {
      src: "/icon-192x192.svg",
      sizes: "192x192",
      type: "image/svg+xml"
    },
    {
      src: "/icon-512x512.svg",
      sizes: "512x512",
      type: "image/svg+xml"
    }
  ]
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('manifest.json generated successfully.');
