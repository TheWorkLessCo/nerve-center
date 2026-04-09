# Nerve Center

A unified operations hub for managing agent memory, documentation, activity feeds, and integrations — all in one place.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL + Realtime) |
| Automation | n8n (webhook workflows) |
| Icons | Lucide React |
| Markdown | react-markdown + remark-gfm |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables) below).

### 3. Start dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Outputs to `dist/`. Preview the build locally:

```bash
npm run preview
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key |
| `VITE_N8N_WEBHOOK_URL` | Yes | Base n8n webhook URL |
| `VITE_N8N_MEMORY_LIST` | Yes | Endpoint for listing memory files |
| `VITE_N8N_MEMORY_READ` | Yes | Endpoint for reading a memory file |
| `VITE_N8N_MEMORY_WRITE` | Yes | Endpoint for writing a memory file |
| `VITE_N8N_CHAT` | Yes | Endpoint for chat messages |
| `VITE_API_SECRET` | No | Secret header for n8n webhook auth |
| `VITE_OPENCLAW_URL` | No | OpenClaw Gateway URL (for embed) |
| `VITE_ALTENZA_URL` | No | Altenza embed URL |

## Features

- **Memory** — Browse and edit agent memory files stored in n8n-backed storage
- **Chat** — Real-time conversation with the Sabbath agent
- **Activity** — Live feed of agent events with error/warning filtering
- **Docs** — Project documentation with full-text search and markdown editing
- **Links** — Quick-access bookmark management
- **OpenClaw** — Embedded OpenClaw Gateway session
- **Altenza** — Embedded Altenza portal

### Keyboard Shortcuts

| Shortcut | Context | Action |
|---|---|---|
| `Ctrl/Cmd + K` | Docs | Focus search |
| `Ctrl/Cmd + Enter` | Chat | Send message |
| `Ctrl/Cmd + S` | Memory | Save current file |
| `Esc` | Any | Close side panels/modals |

### Dark Mode

Toggle via the sun/moon button at the bottom of the sidebar. Preference persists in local memory (not stored across sessions).

## Supabase Schema

The app expects the following tables in Supabase:

- `activity_log` — agent event log
- `chat_messages` — chat history
- `docs` — documentation entries
- `links` — bookmarked links
- `settings` — single-row key/value store (used for health checks)

All tables support Supabase Realtime for live updates.

## Deploy

See [DEPLOY.md](./DEPLOY.md) for step-by-step deployment to Vercel with Supabase and n8n.
