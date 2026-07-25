-- CareCompass: Crisis & Safety Plan Tables
-- ============================================================

-- ============================================================
-- SAFETY PLANS
-- ============================================================
CREATE TABLE safety_plans (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  warning_signs         TEXT[] DEFAULT '{}',
  coping_strategies     TEXT[] DEFAULT '{}',
  social_contacts       JSONB DEFAULT '[]'::jsonb,
  professional_contacts JSONB DEFAULT '[]'::jsonb,
  environment_safety    TEXT[] DEFAULT '{}',
  reasons_to_live       TEXT[] DEFAULT '{}',
  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own safety plans"
  ON safety_plans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own safety plans"
  ON safety_plans FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own safety plans"
  ON safety_plans FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own safety plans"
  ON safety_plans FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- CRISIS RESOURCES (static reference data, public read)
-- ============================================================
CREATE TABLE crisis_resources (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country     TEXT NOT NULL DEFAULT 'US',
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  text        TEXT,
  url         TEXT,
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crisis_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active crisis resources"
  ON crisis_resources FOR SELECT
  USING (is_active = TRUE);

-- ============================================================
-- CRISIS ALERTS (when user triggers emergency)
-- ============================================================
CREATE TABLE crisis_alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  risk_level      TEXT NOT NULL CHECK (risk_level IN ('low','moderate','high','imminent')),
  indicators      TEXT[] DEFAULT '{}',
  action_taken    TEXT CHECK (action_taken IN ('resource_only','safety_plan','emergency_services','crisis_line')),
  resolved        BOOLEAN DEFAULT FALSE,
  resolved_at     TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crisis alerts"
  ON crisis_alerts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own crisis alerts"
  ON crisis_alerts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own crisis alerts"
  ON crisis_alerts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
