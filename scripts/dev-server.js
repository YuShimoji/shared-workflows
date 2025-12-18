const http = require('http');

const port = Number(process.env.PORT || process.env.DEV_SERVER_PORT || 8080);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: 'ok',
      message: 'Shared workflows dev server placeholder running.',
      timestamp: new Date().toISOString(),
    })
  );
});

server.listen(port, () => {
  console.log(`Dev server listening on http://127.0.0.1:${port}/`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Dev server stopped.');
    process.exit(0);
  });
});
