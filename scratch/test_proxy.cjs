const http = require('http');

http.get('http://localhost:5173/bp-images/cdn/shop/products/b187001124322203_300x.jpg', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  res.on('data', () => {});
  res.on('end', () => console.log('End of response'));
}).on('error', (err) => {
  console.error('Error:', err.message);
});
