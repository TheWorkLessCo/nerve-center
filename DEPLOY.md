# Deployment Guide

This guide walks you through deploying Nerve Center to production on Vercel with Supabase as the database and n8n for workflow automation.

---

## 1. Push to GitHub

```bash
cd nerve-center
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/nerve-center.git
git push -u origin main
```

---

## 2. Connect Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**.
3. Select your `nerve-center` repository.
4. In **Framework Preset**, ensure **Vite** is detected.
5. Click **Deploy**.

Vercel will auto-detect the build command (`npm run build`) and output directory (`dist`).

---

## 3. Configure Environment Variables

In the Vercel project dashboard, go to **Settings → Environment Variables** and add each variable:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<project>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `<your-supabase-anon-key>` |
| `VITE_N8N_WEBHOOK_URL` | `https://natetibbs.app.n8n.cloud/webhook` |
| `VITE_N8N_MEMORY_LIST` | `/nerve-memory-list` |
| `VITE_N8N_MEMORY_READ` | `/nerve-memory-read` |
| `VITE_N8N_MEMORY_WRITE` | `/nerve-memory-write` |
| `VITE_N8N_CHAT` | `/nerve-chat` |
| `VITE_API_SECRET` | `<your-secret>` |
| `VITE_OPENCLAW_URL` | `http://72.62.83.62:4000` |
| `VITE_ALTENZA_URL` | _(optional)_ |

After adding all variables, trigger a **redeploy** so they take effect.

---

## 4. Run Supabase Migrations

### Create the project on Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Choose your organization and give the project a name.
3. Set a strong database password and note the region.
4. Wait for the project to provision (~2 minutes).

### Create tables

Open the **SQL Editor** in the Supabase dashboard and run the following:

```sql
-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Docs
CREATE TABLE IF NOT EXISTS docs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  description TEXT,
  project TEXT DEFAULT 'DWB Ops',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Links
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings (single-row key/value, used for health checks)
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  value JSONB DEFAULT '{}'
);

-- Enable Realtime on all tables
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE docs;
ALTER PUBLICATION supabase_realtime ADD TABLE links;
```

### Enable Row Level Security (optional for internal tools)

```sql
-- For a private internal tool, you can disable RLS or configure appropriately:
-- ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE docs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE links DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
```

---

## 5. Import n8n Workflows

1. Log into your n8n instance at `https://natetibbs.app.n8n.cloud`.
2. For each workflow JSON file in `n8n/`:
   - Click **Workflows → Import from JSON**.
   - Paste the contents of the file.
   - Save and **activate** the workflow.
3. Note the webhook URLs for each workflow:
   - `nerve-memory-list` — GET endpoint for listing memory files
   - `nerve-memory-read` — POST endpoint for reading a file
   - `nerve-memory-write` — POST endpoint for writing a file
   - `nerve-chat` — POST endpoint for chat messages
   - `activity-logger` — webhook for logging agent events
   - `docs-crud` — webhook for doc operations
   - `memory-file-ops` — webhook for memory file operations

---

## 6. Configure GHL Custom Menu Links

In your Go High Level (GHL) account:

1. Go to **Settings → Custom Menu Links**.
2. Add a new link:
   - **Label:** `Nerve Center`
   - **URL:** `https://<your-vercel-domain>` (your Vercel deployment URL)
3. Save. The link will appear in the GHL sidebar for your team.

---

## 7. Test Each Tab

After deployment, verify each section:

- [ ] **Memory** — Open a file, make a change, save. Reload and verify persistence.
- [ ] **Chat** — Send a message. Verify it appears in Supabase `chat_messages` table.
- [ ] **Activity** — Trigger an event (e.g. save a doc). Verify it appears in `activity_log`.
- [ ] **Docs** — Create a new doc, edit it, search by title.
- [ ] **Links** — Add a link, verify it saves.
- [ ] **Dark Mode** — Toggle via sidebar button. Verify all views respond.
- [ ] **Keyboard Shortcuts** — Test `Ctrl+K` in Docs, `Ctrl+Enter` in Chat, `Ctrl+S` in Memory.
- [ ] **Offline Banner** — Disconnect network. Verify the orange offline banner appears.

---

## Troubleshooting

### Build fails with "Module not found"

```bash
npm install
npm run build
```

### Supabase connection errors

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct in Vercel env vars.
- Check the Supabase project is not paused (free tier suspends after 7 days of inactivity).
- Run a SELECT query in the Supabase SQL Editor to confirm connectivity.

### n8n webhooks returning 404

- Ensure the n8n workflows are **activated** (not just saved).
- Check the webhook URL in your `.env.local` matches the actual n8n webhook path.

### Realtime not working

- Confirm **Supabase Realtime** is enabled for the project (Supabase Dashboard → Database → Replication).
- Check the browser console for WebSocket connection errors.
