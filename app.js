const express = require('express');
const client = require('prom-client');
const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get('/', (req, res) => res.json({ message: 'Hello DevOps!', version: '1.0' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => console.log('App running on port 3000'));
