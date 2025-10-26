# Solartrucker — simple sync server

This repo contains a static single-page app (`index.html`) and a small Node.js sync server so multiple devices can open the app and keep shared state synchronized.

## Server features
- Serves `index.html` and assets (Express).
- REST endpoints: `GET /state`, `POST /state`.
- WebSocket endpoint: `/ws` for real-time sync.
- Simple last-write-wins conflict resolution using a numeric timestamp (ms since epoch).

## Quick start (Windows PowerShell)

```powershell
# install dependencies
npm install

# start server (listens on port 3000 by default)
node server.js

# open in browser on any device in the same network:
# use http://<server-ip>:3000 or http://localhost:3000 locally
```

## Notes
- The server persists a minimal `data/store.json`. By default it will be created if missing.
- This implementation uses a best-effort sync approach (no operational transform). For many small apps this is fine; for heavy concurrent edits you'll want a more robust CRDT-based approach.

If you want, I can start the server in this environment to smoke-test it (if Node is available), or walk you through running it on your PC or a small VPS.

## Codespaces

This repository includes a devcontainer configuration so you can open it in GitHub Codespaces or VS Code "Remote - Containers". The devcontainer will:

- Use the Node.js development image (Node 18).
- Run `npm install` automatically after the container is created.
- Forward port 3000 (the sync server) and open it in the browser preview.

### How to open in GitHub Codespaces (web UI)

1. Push this repository to GitHub (if not already pushed).
2. On the repository page, click Code → Codespaces → Create codespace on main.

### Or using the GitHub CLI (if authenticated)

```powershell
# create a new codespace (opens in browser)
# replace owner/repo if needed
gh codespace create --repo Martyparty1988/Solartrucker --branch main

# to connect to a codespace in VS Code run
gh codespace code
```

Once the codespace is ready, the devcontainer will run `npm install`. To start the server inside the codespace's terminal:

```powershell
# start the sync server
node server.js
```

The forwarded port 3000 will be available via the Codespaces forwarded ports UI and should open automatically.# Solartrucker — simple sync server

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
