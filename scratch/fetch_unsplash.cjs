const https = require('https');

const queries = ['baby bottle', 'baby stroller', 'diaper bag', 'baby bath', 'baby safety'];

queries.forEach(query => {
  https.get(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.results && json.results.length > 0) {
          console.log(`QUERY: ${query} -> ${json.results[0].urls.raw}&w=600&q=80`);
        }
      } catch (e) {
        console.log(`Error parsing for ${query}`);
      }
    });
  }).on('error', e => console.log(e));
});
