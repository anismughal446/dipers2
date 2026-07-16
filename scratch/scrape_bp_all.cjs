const cheerio = require('cheerio');
const https = require('https');

function scrape(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const $ = cheerio.load(data);
      const images = new Set();
      $('img').each((i, el) => {
        let src = $(el).attr('src') || $(el).attr('data-src');
        if (src && src.includes('cdn/shop/files')) {
          if (src.startsWith('//')) src = 'https:' + src;
          src = src.split('?')[0]; // clean up
          images.add(src);
        }
      });
      console.log(Array.from(images));
    });
  }).on('error', e => console.error(e));
}

scrape('https://babyplanet.pk/');
