// proxy server to avoid CORS issues, ended up not using this, can be deleted honestly, but might play with it later

const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

app.use('/api', async (req, res) => {
  const url = 'https://challenge.crossmint.com/api' + req.url;
  const options = {
    method: req.method,
    headers: { ...req.headers, host: undefined },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
  };
  try {
    const response = await fetch(url, options);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).send('Proxy error');
  }
});

app.listen(4000, () => console.log('Proxy listening on port 4000'));
