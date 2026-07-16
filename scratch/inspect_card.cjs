const https = require('https');
const cheerio = require('cheerio');

https.get('https://babyplanet.pk/collections/new-arrival', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const card = $('.t4s-product').first();
    console.log("Card HTML:\n", card.html());
  });
}).on('error', e => console.error(e));
