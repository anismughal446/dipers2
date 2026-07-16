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
        let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
        if (src && src.includes('cdn/shop')) {
          if (src.startsWith('//')) src = 'https:' + src;
          // remove query params like ?v=
          src = src.split('?')[0];
          images.add(src);
        }
      });
      console.log(`--- Images from ${url} ---`);
      console.log(Array.from(images).slice(0, 15));
    });
  }).on('error', e => console.error(e));
}

scrape('https://babyplanet.pk/');
