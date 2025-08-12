import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

import { WebSocketServer } from 'ws'

const dev = process.env.NODE_ENV !== 'production';

console.log("Starting server.js", dev ? "in development mode" : "in production mode" );

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

 

  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

    console.log("WebSocket upgrade request for:", pathname);

   
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
