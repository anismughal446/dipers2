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
    
    // Find all links to products
    const productLinks = [];
    $('a[href*="/products/"]').each((i, el) => {
      productLinks.push({
        href: $(el).attr('href'),
        text: $(el).text().trim(),
        parentClasses: $(el).parent().attr('class'),
        grandparentClasses: $(el).parent().parent().attr('class'),
        greatGrandparentClasses: $(el).parent().parent().parent().attr('class')
      });
    });
    
    console.log("Found product links:", productLinks.slice(0, 15));
    
    // Let's find one product card structure
    // Typically it's inside a div with class like "t4s-product" or similar
    const prCards = $('.t4s-product, [class*="product-card"], .t4s-col-item');
    console.log("Number of cards found:", prCards.length);
    if (prCards.length > 0) {
      console.log("First card HTML snippet:\n", $(prCards.get(0)).html().substring(0, 2000));
    }
  });
}).on('error', e => console.error(e));
