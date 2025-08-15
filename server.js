const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const { execSync } = require('child_process');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Generate self-signed certs if not present
if (!fs.existsSync('./certs/key.pem')) {
  console.log('🔐 Generating self-signed cert...');
  execSync(`
    mkdir -p ./certs &&
    openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout ./certs/key.pem -out ./certs/cert.pem \
    -days 365 -subj "/CN=localhost"
  `);
}

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(443, err => {
    if (err) throw err;
    console.log('✅ HTTPS server running at https://localhost');
  });
});
