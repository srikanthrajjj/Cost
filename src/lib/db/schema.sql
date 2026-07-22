-- CostReno storage schema (Postgres / Neon)
-- Run once against your DATABASE_URL, e.g.:
--   psql "$DATABASE_URL" -f src/lib/db/schema.sql

CREATE TABLE IF NOT EXISTS quote_uploads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  raw_text TEXT NOT NULL,
  project_type TEXT,
  contractor TEXT,
  total_price DOUBLE PRECISION,
  actual_paid DOUBLE PRECISION,
  completeness_score DOUBLE PRECISION,
  line_item_count INTEGER,
  missing_count INTEGER,
  clarification_count INTEGER,
  red_flag_count INTEGER,
  analysis_summary JSONB,
  source TEXT DEFAULT 'quote-analyzer'
);

CREATE INDEX IF NOT EXISTS quote_uploads_created_at_idx ON quote_uploads (created_at DESC);

CREATE TABLE IF NOT EXISTS quote_feedback (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  quote_upload_id TEXT,
  accuracy TEXT,
  understandable TEXT,
  use_again TEXT,
  amount_paid DOUBLE PRECISION,
  comment TEXT,
  project_type TEXT,
  contractor TEXT,
  completeness_score DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS quote_feedback_created_at_idx ON quote_feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS quote_feedback_quote_upload_id_idx ON quote_feedback (quote_upload_id);

CREATE TABLE IF NOT EXISTS comparison_reports (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  snapshot JSONB NOT NULL,
  quote_count INTEGER NOT NULL,
  project_type TEXT,
  recommended_contractor TEXT,
  source TEXT DEFAULT 'quote-comparison',
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS comparison_reports_created_at_idx ON comparison_reports (created_at DESC);

CREATE TABLE IF NOT EXISTS page_visits (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  city TEXT,
  region TEXT,
  country TEXT,
  country_code TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS page_visits_created_at_idx ON page_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS page_visits_session_id_idx ON page_visits (session_id);

