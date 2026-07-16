const https = require('https');

const urls = [
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
  "https://images.unsplash.com/photo-1522771930-78848d928718?w=600&q=80",
  "https://images.unsplash.com/photo-1579621970220-4e3ed9d90bb3?w=600&q=80",
  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80",
  "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=600&q=80",
  "https://images.unsplash.com/photo-1590424744257-f404dc223a56?w=600&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
  "https://images.unsplash.com/photo-1555252117-426bf85fc7eb?w=600&q=80",
  "https://images.unsplash.com/photo-1596700810376-79d8544c01d4?w=200&q=80",
  "https://images.unsplash.com/photo-1584347781702-6c84144af777?w=200&q=80",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=200&q=80"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} - ${url}`);
  }).on('error', (e) => {
    console.error(`Error for ${url}: ${e.message}`);
  });
});
