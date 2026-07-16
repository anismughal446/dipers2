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
    console.log("Status Code:", res.statusCode);
    const $ = cheerio.load(data);
    // Find the first few elements with product-like classes or print a snippet of HTML to inspect
    console.log("HTML length:", data.length);
    
    // Let's print some of the HTML classes to see
    const elements = [];
    $('*').each((i, el) => {
      const className = $(el).attr('class');
      if (className && (className.includes('product') || className.includes('pr_') || className.includes('t4s-col'))) {
        elements.push({ tag: el.name, class: className });
      }
    });
    console.log("Found matching elements:", elements.slice(0, 10));
  });
}).on('error', e => console.error(e));
