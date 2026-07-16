const https = require('https');

function getBabyPlanetImages() {
  return new Promise((resolve, reject) => {
    https.get('https://babyplanet.pk/', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https:\/\/[^?\"]+\.(jpg|png|webp|jpeg)/g) || [];
        console.log("Data sample:", data.substring(0, 500));
        console.log("Found matches:", matches.slice(0, 10));
        resolve(matches);
      });
    }).on('error', reject);
  });
}

getBabyPlanetImages().then(imgs => console.log(imgs.slice(0, 10))).catch(console.error);
