const https = require('https');

https.get('https://babyplanet.pk/collections/school-supplies', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/babyplanet\.pk\/cdn\/shop\/files\/[^"]+\.jpg/g) || [];
    console.log("School:", [...new Set(matches)].slice(0, 5));
  });
});

https.get('https://babyplanet.pk/collections/baby-safety', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/babyplanet\.pk\/cdn\/shop\/files\/[^"]+\.jpg/g) || [];
    console.log("Safety:", [...new Set(matches)].slice(0, 5));
  });
});
