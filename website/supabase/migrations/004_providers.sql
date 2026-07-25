-- CareCompass: Provider Directory Extras
-- ============================================================

-- ============================================================
-- PROVIDER REVIEWS
-- ============================================================
CREATE TABLE provider_reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment         TEXT,
  is_anonymous    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, user_id)
);

ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view provider reviews"
  ON provider_reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can insert own reviews"
  ON provider_reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON provider_reviews FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON provider_reviews FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- PROVIDER AVAILABILITY (recurring weekly schedule)
-- ============================================================
CREATE TABLE provider_availability (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week     INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  slot_minutes    INTEGER DEFAULT 30,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CHECK (start_time < end_time)
);

ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view provider availability"
  ON provider_availability FOR SELECT
  USING (TRUE);

CREATE POLICY "Providers can manage own availability"
  ON provider_availability FOR ALL
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());
