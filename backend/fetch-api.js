const http = require('http');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const form = new FormData();
form.append('file', fs.createReadStream(path.join(__dirname, 'test-data', 'messy.csv')), {
  filename: 'messy.csv',
  contentType: 'text/csv',
});

const request = http.request({
  method: 'POST',
  host: 'localhost',
  port: 5000,
  path: '/api/import',
  headers: form.getHeaders()
}, (response) => {
  let data = '';
  response.on('data', chunk => data += chunk);
  response.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.imported) {
         fs.writeFileSync('output.json', JSON.stringify(parsed.imported, null, 2));
         console.log('Saved to output.json');
      } else {
         console.log(data);
      }
    } catch(e) {
      console.log('Error parsing JSON:', data);
    }
  });
});

form.pipe(request);
