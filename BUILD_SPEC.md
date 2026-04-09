# Nerve Center — Build Specification (Corrected)

## What to Build
A Vite + React 18 + Tailwind CSS dashboard with 7 views. Each view is a standalone page (no internal sidebar — GHL provides navigation via iframes).

## Corrected Agent Registry
| Agent | Display Name | Color |
|-------|-------------|-------|
| sabbath | Sabbath | coral (#D85A30) |
| onboarder | Onboarder | purple (#7F77DD) |
| dwb-ops | DWB Ops | teal (#1D9E75) |
| twc-ops | TWC Ops | blue (#185FA5) |

## Corrected Memory File Paths
Actual VPS paths:
- Agent memory: `~/.openclaw/workspace-{agent-id}/MEMORY.md`
- Shared memory: `~/.openclaw/memory/*.md`
- Memory root for listing: `~/.openclaw/`

## Tabs (7 routes)
1. `/memory` — File tree + markdown editor for agent memory MD files
2. `/chat` — Claude API chat via n8n webhook
3. `/activity` — Real-time agent activity feed (Supabase realtime)
4. `/docs` — Document CRUD (Supabase)
5. `/links` — Quick links grid (static)
6. `/openclaw` — iframe embed (OpenClaw Mission Control)
7. `/altenza` — iframe embed (Autenza Mission Control)

## Tech Stack
- React 18, Vite, Tailwind CSS v3, react-router-dom v6
- @supabase/supabase-js
- react-markdown + remark-gfm
- lucide-react (icons)
- highlight.js (markdown syntax highlighting in editor)

## Project Structure
```
src/
├── main.jsx
├── App.jsx
├── index.css
├── components/
│   ├── Layout.jsx
│   ├── StatusBadge.jsx
│   ├── FileTree.jsx
│   ├── MarkdownEditor.jsx
│   ├── ChatMessage.jsx
│   ├── ActivityRow.jsx
│   ├── DocCard.jsx
│   ├── LinkCard.jsx
│   └── MetricCard.jsx
├── views/
│   ├── MemoryView.jsx
│   ├── ChatView.jsx
│   ├── ActivityView.jsx
│   ├── DocsView.jsx
│   ├── LinksView.jsx
│   ├── OpenClawView.jsx
│   └── AltenzaView.jsx
├── hooks/
│   ├── useSupabase.js
│   ├── useAuth.js
│   ├── useRealtime.js
│   └── useN8n.js
├── lib/
│   ├── supabase.js
│   ├── api.js
│   └── constants.js
└── utils/
    ├── formatDate.js
    └── markdown.js
```

## Supabase Schema
```sql
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  agent_name TEXT NOT NULL,
  agent_color TEXT DEFAULT 'teal',
  action TEXT NOT NULL,
  status TEXT DEFAULT 'success',
  metadata JSONB DEFAULT '{}'::jsonb,
  project TEXT DEFAULT 'general'
);

CREATE TABLE docs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  project TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_archived BOOLEAN DEFAULT false
);

CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT DEFAULT 'claude',
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_agent ON activity_log(agent_name);
CREATE INDEX idx_activity_status ON activity_log(status);
CREATE INDEX idx_docs_project ON docs(project);
CREATE INDEX idx_docs_updated ON docs(updated_at DESC);
CREATE INDEX idx_chat_created ON chat_messages(created_at ASC);

ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON activity_log FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON docs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON chat_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON settings FOR ALL USING (auth.role() = 'authenticated');
```

## n8n Webhook Endpoints
All use header `X-API-Secret` for auth.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/nerve-memory-list` | GET | List memory MD files on VPS |
| `/nerve-memory-read` | POST | Read file content: `{ filename, directory }` |
| `/nerve-memory-write` | POST | Write file: `{ filename, directory, content }` |
| `/nerve-chat` | POST | Claude API proxy: `{ message, history }` |
| `/nerve-activity-log` | POST | Log agent activity: `{ agent_name, action, status, project, metadata }` |
| `/nerve-docs-list` | GET | List docs |
| `/nerve-docs-create` | POST | Create doc: `{ title, content, project, tags }` |
| `/nerve-docs-update` | POST | Update doc: `{ id, title, content, project, tags }` |
| `/nerve-docs-delete` | POST | Delete doc: `{ id }` |

## Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_N8N_BASE_URL=https://natetibbs.app.n8n.cloud/webhook
VITE_OPENCLAW_URL=
VITE_ALTENZA_URL=
VITE_API_SECRET=
```

## Design System
- Dark mode default (class strategy)
- Primary accent: #5DCAA5 (teal)
- Error: #E24B4A, Warning: #EF9F27
- Dark bg: #0a0a0a, cards: #141414, surfaces: #1a1a1a
- Light: #fafafa, #ffffff, #f5f5f5
- Body font: Inter/system 14px, Code: JetBrains Mono 13px
- Cards: rounded-lg, border, p-4
- Buttons: rounded-md, primary = teal bg
- Badges: rounded-md, 15% opacity bg, colored text

## Quick Links (static)
```javascript
export const QUICK_LINKS = [
  { name: "OpenClaw", url: "#", icon: "monitor" },
  { name: "Autenza", url: "#", icon: "layers" },
  { name: "n8n", url: "https://natetibbs.app.n8n.cloud", icon: "workflow" },
  { name: "Supabase", url: "#", icon: "database" },
  { name: "Vercel", url: "#", icon: "triangle" },
  { name: "Notion", url: "#", icon: "edit" },
  { name: "ElevenLabs", url: "#", icon: "mic" },
  { name: "GHL Admin", url: "https://app.gohighlevel.com", icon: "external" },
  { name: "Cloudflare", url: "#", icon: "cloud" },
  { name: "OpenRouter", url: "https://openrouter.ai", icon: "cpu" },
];
```

## Auth Flow
- Supabase Auth magic link (email-based)
- Check session on load → no session = login screen
- All webhook calls include X-API-Secret header

## Key Behaviors
- Memory view: left panel file tree (220px), right panel editor, "Push to VPS" saves via n8n webhook
- Chat view: scrollable messages, preset quick action buttons, sends to n8n webhook → Claude API
- Activity view: metric cards top (Today count, Errors count, Agents online), filter bar, activity list with realtime subscription
- Docs view: card grid, click opens editor, client-side search
- Links view: icon grid, opens in new tab
- OpenClaw/Autenza views: full-height iframes

## Build Requirements
- `npm run build` must succeed
- vercel.json with SPA rewrites (fallback to index.html)
- .env.example file
- All routes work as standalone pages
- No shared navigation component (GHL handles that)
