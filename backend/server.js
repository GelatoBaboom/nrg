import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateAll } from '../service/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.OFFLINE = '1';

let cachedResults;
async function getResults() {
  if (!cachedResults) {
    cachedResults = await calculateAll();
  }
  return cachedResults;
}

function sendFile(res, file, contentType) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/results') {
    try {
      const data = await getResults();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500);
      res.end('Error calculating results');
    }
  } else if (req.url === '/' || req.url === '/index.html') {
    sendFile(res, path.join(__dirname, '../frontend/index.html'), 'text/html');
  } else if (req.url === '/app.js') {
    sendFile(res, path.join(__dirname, '../frontend/app.js'), 'application/javascript');
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default server;
