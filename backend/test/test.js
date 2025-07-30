import http from 'http';
import server from '../server.js';

server.listen(0, () => {
  const port = server.address().port;
  http.get(`http://localhost:${port}/results`, res => {
    console.log('Status:', res.statusCode);
    server.close();
  });
});
