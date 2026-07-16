const cheerio = require('cheerio');
const https = require('https');

https.get('https://dyper.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const images = [];
    $('img').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.startsWith('data:')) {
        if (src.startsWith('//')) src = 'https:' + src;
        else if (src.startsWith('/')) src = 'https://dyper.com' + src;
        images.push(src);
      }
    });
    console.log(JSON.stringify(images.slice(0, 20), null, 2));
  });
});
