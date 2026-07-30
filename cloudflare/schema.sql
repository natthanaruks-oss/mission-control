-- Mission Control Phase 3 foundation
-- Apply only after reviewing authentication, data ownership and retention requirements.

CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  outcome TEXT NOT NULL,
  owner TEXT NOT NULL,
  project TEXT,
  due_at TEXT NOT NULL,
  effort_minutes INTEGER NOT NULL DEFAULT 60,
  impact TEXT NOT NULL,
  consequence_score INTEGER NOT NULL DEFAULT 50,
  commitment_score INTEGER NOT NULL DEFAULT 50,
  unlock_score INTEGER NOT NULL DEFAULT 30,
  focus_type TEXT NOT NULL,
  energy_required TEXT NOT NULL,
  readiness_score INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL,
  next_action TEXT NOT NULL,
  blocker TEXT,
  progress INTEGER NOT NULL DEFAULT 0,
  scheduled_start_at TEXT,
  scheduled_end_at TEXT,
  schedule_kind TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_missions_due_at ON missions(due_at);
CREATE INDEX IF NOT EXISTS idx_missions_owner_status ON missions(owner, status);
CREATE INDEX IF NOT EXISTS idx_missions_scheduled_start ON missions(scheduled_start_at);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  project TEXT,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  linked_mission_id TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (linked_mission_id) REFERENCES missions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON calendar_events(start_at);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_key TEXT PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'th',
  calendar_view TEXT NOT NULL DEFAULT 'week',
  workday_start INTEGER NOT NULL DEFAULT 8,
  workday_end INTEGER NOT NULL DEFAULT 18,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_key TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);
