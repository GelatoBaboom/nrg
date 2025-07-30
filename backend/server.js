import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readResults() {
  const file = path.join(__dirname, '../service/results.json');
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  }
  return [];
}

const server = http.createServer((req, res) => {
  if (req.url === '/results') {
    const data = readResults();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = 3000;
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

export default server;
