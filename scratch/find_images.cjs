const https = require('https');

https.get('https://babyplanet.pk/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // Look for image sources in the HTML using a regex
    const matches = data.match(/src="([^"]+)"/g) || [];
    console.log(matches.slice(0, 20)); // Print first 20 matches
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
