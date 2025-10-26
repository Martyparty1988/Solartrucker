# Solartrucker — simple sync server

This repo contains a static single-page app (`index.html`) and a small Node.js sync server so multiple devices can open the app and keep shared state synchronized.

Server features
- Serves `index.html` and assets (Express).
- REST endpoints: `GET /state`, `POST /state`.
- WebSocket endpoint: `/ws` for real-time sync.
- Simple last-write-wins conflict resolution using a numeric timestamp (ms since epoch).

Quick start (Windows PowerShell)

```powershell
# install dependencies
npm install

# start server (listens on port 3000 by default)
node server.js

# open in browser on any device in the same network:
# use http://<server-ip>:3000 or http://localhost:3000 locally
```

Notes
- The server persists a minimal `data/store.json`. By default it will be created if missing.
- This implementation uses a best-effort sync approach (no operational transform). For many small apps this is fine; for heavy concurrent edits you'll want a more robust CRDT-based approach.

If you want, I can start the server in this environment to smoke-test it (if Node is available), or walk you through running it on your PC or a small VPS.
