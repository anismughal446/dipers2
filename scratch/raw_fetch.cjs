const https = require('https');

https.get('https://babyplanet.pk/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 10000)); // Print first 10k chars
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
