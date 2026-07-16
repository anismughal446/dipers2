const https = require('https');
const cheerio = require('cheerio');
const sqlite3 = require('../server/node_modules/sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../server/babyplanet.db');

// Keyword-based classification function
function getCategory(title, vendor) {
  const t = title.toLowerCase();
  const v = (vendor || '').toLowerCase();
  
  if (t.includes('dress') || t.includes('socks') || t.includes('cap') || t.includes('t-shirt') || 
      t.includes('overalls') || t.includes('set') || t.includes('headband') || t.includes('romper') || 
      t.includes('frock') || t.includes('trouser') || t.includes('suit') || t.includes('jacket') || 
      t.includes('shirt') || t.includes('pant') || t.includes('shoe') || t.includes('booties') ||
      t.includes('clothing') || t.includes('tights') || t.includes('bibs & booties') || t.includes('headband & socks')) {
    return 'fashion';
  }
  if (t.includes('stroller') || t.includes('car seat') || t.includes('carrier') || 
      t.includes('travel') || t.includes('pram') || t.includes('cradle') || t.includes('swing')) {
    return 'gear';
  }
  if (t.includes('bottle') || t.includes('feeding') || t.includes('spoon') || t.includes('bib') || 
      t.includes('sippy') || t.includes('warmer') || t.includes('nipple') || t.includes('feeder') || 
      t.includes('cup') || t.includes('teether') || t.includes('breast pump') || t.includes('sterilizer')) {
    return 'feeding';
  }
  if (t.includes('towel') || t.includes('shampoo') || t.includes('wash') || t.includes('lotion') || 
      t.includes('bath') || t.includes('oil') || t.includes('soap') || t.includes('powder') || 
      t.includes('grooming kit') || t.includes('comb') || t.includes('brush') || t.includes('cream')) {
    return 'bath';
  }
  if (t.includes('lock') || t.includes('protector') || t.includes('safety') || t.includes('gate') || 
      t.includes('monitor') || t.includes('corner') || t.includes('camera') || t.includes('safety gate')) {
    return 'safety';
  }
  if (t.includes('rattle') || t.includes('toy') || t.includes('piano') || t.includes('plush') || 
      t.includes('bunny') || t.includes('teddy') || t.includes('puzzle') || t.includes('blocks') || 
      t.includes('gym') || t.includes('play') || t.includes('slide') || t.includes('doll') || 
      t.includes('playmat') || t.includes('rocker')) {
    return 'toys';
  }
  if (t.includes('diaper') || t.includes('wipes') || t.includes('rash cream') || t.includes('diaper bag')) {
    return 'diapering';
  }
  if (t.includes('cot') || t.includes('sheet') || t.includes('nursery') || t.includes('crib') || 
      t.includes('blanket') || t.includes('bed') || t.includes('pillow') || t.includes('playpen') || 
      t.includes('mattress') || t.includes('lamp')) {
    return 'nursery';
  }
  if (t.includes('maternity') || t.includes('postpartum') || t.includes('nursing') || 
      t.includes('breast') || t.includes('stretch mark') || t.includes('mom')) {
    return 'moms';
  }
  if (t.includes('backpack') || t.includes('lunch box') || t.includes('lunchbox') || 
      t.includes('water bottle') || t.includes('stationery') || t.includes('school') || 
      t.includes('notebook') || t.includes('pencil')) {
    return 'school';
  }

  // Fallbacks based on typical brands
  if (v.includes('schoolmate')) return 'school';
  if (v.includes('infantes')) return 'gear';
  if (v.includes('safehome')) return 'safety';

  // Default fallback categories to ensure even distribution
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbacks = ['fashion', 'feeding', 'toys', 'bath', 'nursery'];
  return fallbacks[hash % fallbacks.length];
}

// Fetch a single page
function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const url = `https://babyplanet.pk/collections/new-arrival?page=${page}`;
    console.log(`Fetching ${url}...`);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to load page ${page}: Status ${res.statusCode}`));
          return;
        }
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Main scrape function
async function main() {
  const uniqueProducts = [];
  const seenImages = new Set();
  const seenTitles = new Set();

  // Scrape 5 pages to get plenty of unique products
  for (let page = 1; page <= 5; page++) {
    try {
      const html = await fetchPage(page);
      const $ = cheerio.load(html);
      const cards = $('.t4s-product');
      
      console.log(`Page ${page}: found ${cards.length} product cards`);
      if (cards.length === 0) break;

      cards.each((i, el) => {
        // Title
        const title = $(el).find('.t4s-product-title a').text().trim();
        if (!title || seenTitles.has(title)) return;

        // Vendor
        const vendor = $(el).find('.t4s-product-vendor a').text().trim() || 'BabyPlanet';

        // Image
        let rawSrc = $(el).find('img[data-pr-img]').attr('data-src') || $(el).find('noscript img').attr('src');
        if (!rawSrc) return;

        // Clean image URL to get filename
        if (rawSrc.startsWith('//')) rawSrc = 'https:' + rawSrc;
        rawSrc = rawSrc.split('?')[0]; // strip query parameters
        const filename = rawSrc.substring(rawSrc.lastIndexOf('/') + 1);

        // Check uniqueness of image
        if (seenImages.has(filename)) {
          // Skip duplicate images as requested by the user
          return;
        }

        // Price
        const priceTextEl = $(el).find('.t4s-product-price');
        let price = 0;
        let oldPrice = null;

        const insEl = priceTextEl.find('ins');
        const delEl = priceTextEl.find('del');

        if (insEl.length > 0) {
          price = parseInt(insEl.text().replace(/[^\d]/g, '')) || 0;
        } else {
          // If no ins element, just parse the main price text
          price = parseInt(priceTextEl.text().replace(/[^\d]/g, '')) || 0;
        }

        if (delEl.length > 0) {
          oldPrice = parseInt(delEl.text().replace(/[^\d]/g, '')) || null;
        }

        // Map to category
        const category = getCategory(title, vendor);

        // Add to list
        seenImages.add(filename);
        seenTitles.add(title);
        uniqueProducts.push({
          name: title,
          brand: vendor,
          price: price,
          old_price: oldPrice,
          image: `/bp/cdn/shop/files/${filename}`, // Use Vite proxy prefix to bypass hotlinking protection
          category: category,
          vendor: vendor,
          is_sale: oldPrice ? 1 : 0,
          is_new: 1
        });
      });
    } catch (err) {
      console.error(`Error scraping page ${page}:`, err.message);
    }
  }

  console.log(`Scraped total of ${uniqueProducts.length} unique products with unique images`);

  if (uniqueProducts.length === 0) {
    console.error("No products scraped. Aborting database update.");
    return;
  }

  // Open database and update
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    // Drop existing table or clear it
    db.run(`DELETE FROM products`);
    console.log("Cleared existing products from database.");

    const stmt = db.prepare(`INSERT INTO products (name, brand, price, old_price, image, category, vendor, is_sale, is_new) VALUES (?,?,?,?,?,?,?,?,?)`);

    for (const p of uniqueProducts) {
      stmt.run(p.name, p.brand, p.price, p.old_price, p.image, p.category, p.vendor, p.is_sale, p.is_new);
    }

    stmt.finalize();
    console.log(`Successfully inserted ${uniqueProducts.length} unique products into database!`);
  });

  db.close();
}

main();
