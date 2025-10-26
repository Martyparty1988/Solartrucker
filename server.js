const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let store = { state: {}, ts: 0 };

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      store = JSON.parse(raw);
    } else {
      persist();
    }
  } catch (e) {
    console.error('Failed to load store:', e);
  }
}

function persist() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to persist store:', e);
  }
}

loadStore();

const app = express();
app.use(express.json({ limit: '2mb' }));

// Serve static site (index.html and assets)
app.use(express.static(path.join(__dirname)));

// REST endpoints for state
app.get('/state', (req, res) => {
  res.json(store);
});

app.post('/state', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming) return res.status(400).json({ error: 'missing body' });

    const incomingTs = parseInt(incoming.ts || 0, 10) || 0;
    if (incomingTs > store.ts) {
      store.state = incoming.state || {};
      store.ts = incomingTs;
      persist();
      // notify ws clients
      broadcast({ type: 'sync', state: store.state, ts: store.ts });
    }

    res.json(store);
  } catch (e) {
    console.error('POST /state error', e);
    res.status(500).json({ error: 'server error' });
  }
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/ws' });

function broadcast(obj) {
  const raw = JSON.stringify(obj);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
    }
  });
}

wss.on('connection', (ws, req) => {
  try {
    // send current state on connect
    ws.send(JSON.stringify({ type: 'state', state: store.state, ts: store.ts }));

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg.toString());
        if (data && data.type === 'sync') {
          const incomingTs = parseInt(data.ts || 0, 10) || 0;
          if (incomingTs > store.ts) {
            store.state = data.state || {};
            store.ts = incomingTs;
            persist();
            broadcast({ type: 'sync', state: store.state, ts: store.ts });
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    });
  } catch (e) {
    console.error('ws connection handler', e);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Solartrucker sync server listening on port ${PORT}`);
});
