const express = require('express');
const client = require('prom-client');

const app = express();
const VERSION = process.env.APP_VERSION || 'dev';
const ERROR_RATE = parseFloat(process.env.ERROR_RATE || '0');

client.collectDefaultMetrics();
const requests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['status'],
});

app.get('/healthz', (req, res) => res.send('ok'));

app.get('/', (req, res) => {
  if (Math.random() < ERROR_RATE) {
    requests.inc({ status: '500' });
    return res.status(500).json({ version: VERSION, error: 'injected' });
  }
  requests.inc({ status: '200' });
  res.json({ version: VERSION, message: 'hello from demo-app' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

if (require.main === module) {
  app.listen(8080, () => console.log(`demo-app ${VERSION} on :8080`));
}

module.exports = app;