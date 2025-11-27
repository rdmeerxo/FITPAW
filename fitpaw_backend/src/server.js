import https from 'https';
import fs from 'fs';
import app from './app.js';

const PORT = process.env.PORT || 3001;

// HTTPS configuration
const httpsOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert')
};

// Create HTTPS server
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Cat health API running on HTTPS port ${PORT}`);
});