-- Nerve Center Database Schema
-- Migration: 001_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: activity_log
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name TEXT NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'success', 'error', 'cancelled')),
    project TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for activity_log
CREATE INDEX IF NOT EXISTS idx_activity_log_agent_name ON activity_log(agent_name);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_status ON activity_log(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_project ON activity_log(project);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_metadata ON activity_log USING GIN(metadata);

-- Realtime for activity_log
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- ============================================
-- TABLE: docs
-- ============================================
CREATE TABLE IF NOT EXISTS docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for docs
CREATE INDEX IF NOT EXISTS idx_docs_slug ON docs(slug);
CREATE INDEX IF NOT EXISTS idx_docs_category ON docs(category);
CREATE INDEX IF NOT EXISTS idx_docs_author_id ON docs(author_id);
CREATE INDEX IF NOT EXISTS idx_docs_published ON docs(published);
CREATE INDEX IF NOT EXISTS idx_docs_created_at ON docs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_docs_tags ON docs USING GIN(tags);

-- ============================================
-- TABLE: chat_messages
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'function')),
    content TEXT NOT NULL,
    model TEXT,
    token_count INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_metadata ON chat_messages USING GIN(metadata);

-- ============================================
-- TABLE: settings
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for settings
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read activity_log (for dashboard display)
CREATE POLICY "Anyone can read activity_log"
    ON activity_log FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert activity_log
CREATE POLICY "Authenticated users can insert activity_log"
    ON activity_log FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Service role can do anything with activity_log
CREATE POLICY "Service role can manage activity_log"
    ON activity_log FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Policy: Anyone can read published docs
CREATE POLICY "Anyone can read published docs"
    ON docs FOR SELECT
    USING (published = true);

-- Policy: Authenticated users can read all docs
CREATE POLICY "Authenticated users can read all docs"
    ON docs FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert docs
CREATE POLICY "Authenticated users can insert docs"
    ON docs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authors can update their own docs
CREATE POLICY "Authors can update their own docs"
    ON docs FOR UPDATE
    USING (auth.uid() = author_id OR auth.role() = 'service_role');

-- Policy: Authors can delete their own docs
CREATE POLICY "Authors can delete their own docs"
    ON docs FOR DELETE
    USING (auth.uid() = author_id OR auth.role() = 'service_role');

-- Policy: Anyone can read chat_messages for their session
CREATE POLICY "Users can read their own chat messages"
    ON chat_messages FOR SELECT
    USING (true); -- Adjust based on session ownership if needed

-- Policy: Authenticated users can insert chat_messages
CREATE POLICY "Authenticated users can insert chat_messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only service role can read/update/delete settings
CREATE POLICY "Service role can manage settings"
    ON settings FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: activity_log updated_at
DROP TRIGGER IF EXISTS update_activity_log_updated_at ON activity_log;
CREATE TRIGGER update_activity_log_updated_at
    BEFORE UPDATE ON activity_log
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: docs updated_at
DROP TRIGGER IF EXISTS update_docs_updated_at ON docs;
CREATE TRIGGER update_docs_updated_at
    BEFORE UPDATE ON docs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: chat_messages updated_at
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: settings updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Set published_at when published becomes true
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.published = true AND OLD.published = false THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: docs published_at
DROP TRIGGER IF EXISTS set_docs_published_at ON docs;
CREATE TRIGGER set_docs_published_at
    BEFORE UPDATE ON docs
    FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- ============================================
-- INITIAL SEED DATA
-- ============================================

-- Default settings
INSERT INTO settings (key, value, description, category, is_secret) VALUES
    ('app_name', '"Nerve Center"', 'Application name', 'general', false),
    ('default_model', '"claude-sonnet-4-20250514"', 'Default AI model', 'ai', false),
    ('max_tokens', '4096', 'Default max tokens for AI responses', 'ai', false),
    ('activity_retention_days', '30', 'Days to retain activity logs', 'data', false)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE activity_log IS 'Central activity logging for all agents';
COMMENT ON TABLE docs IS 'Documentation and knowledge base articles';
COMMENT ON TABLE chat_messages IS 'Chat conversation history';
COMMENT ON TABLE settings IS 'Application settings and configuration';
