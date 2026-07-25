-- CareCompass: Core tables
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  phone         TEXT,
  date_of_birth DATE,
  gender        TEXT CHECK (gender IN ('male', 'female', 'non_binary', 'other')),
  address       TEXT,
  city          TEXT,
  state         TEXT,
  zip_code      TEXT,
  country       TEXT DEFAULT 'US',
  emergency_contact_name     TEXT,
  emergency_contact_phone    TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  consent_given       BOOLEAN DEFAULT FALSE,
  goals          JSONB DEFAULT '[]'::jsonb,
  crisis_contacts    JSONB DEFAULT '[]'::jsonb,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PATIENTS (clinical records linked to profiles)
-- ============================================================
CREATE TABLE patients (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blood_group        TEXT CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  medical_history    TEXT,
  allergies          TEXT,
  insurance_provider TEXT,
  insurance_number   TEXT,
  status             TEXT DEFAULT 'active' CHECK (status IN ('active','critical','inactive')),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- ============================================================
-- PROVIDERS (healthcare providers / doctors)
-- ============================================================
CREATE TABLE providers (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  npi                 TEXT UNIQUE,
  name                TEXT NOT NULL,
  credentials         TEXT[] DEFAULT '{}',
  specialties         TEXT[] DEFAULT '{}',
  provider_type       TEXT NOT NULL CHECK (provider_type IN ('primary_care','specialist','therapist','psychiatrist','counselor','nurse','pharmacist','other')),
  bio                 TEXT,
  license_state       TEXT[] DEFAULT '{}',
  license_number      TEXT,
  accepts_insurance   BOOLEAN DEFAULT TRUE,
  insurance_networks  TEXT[] DEFAULT '{}',
  sliding_scale       BOOLEAN DEFAULT FALSE,
  min_fee_cents       INTEGER,
  max_fee_cents       INTEGER,
  languages           TEXT[] DEFAULT '{"en"}',
  telehealth          BOOLEAN DEFAULT TRUE,
  in_person           BOOLEAN DEFAULT FALSE,
  address             TEXT,
  lat                 DOUBLE PRECISION,
  lng                 DOUBLE PRECISION,
  availability        JSONB DEFAULT '{}'::jsonb,
  avatar_url          TEXT,
  is_verified         BOOLEAN DEFAULT FALSE,
  rating_avg          NUMERIC(3,2) DEFAULT 0,
  rating_count        INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  type            TEXT DEFAULT 'in-person' CHECK (type IN ('in-person','video','follow-up')),
  status          TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','confirmed','in-progress','completed','cancelled','no-show')),
  reason          TEXT,
  notes           TEXT,
  diagnosis       TEXT,
  location        TEXT,
  meeting_url     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDICAL REPORTS
-- ============================================================
CREATE TABLE medical_reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  file_url        TEXT NOT NULL,
  file_type       TEXT CHECK (file_type IN ('pdf','image','lab_result','other')),
  file_size       BIGINT,
  report_date     DATE,
  uploaded_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ai_summary      JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDICATIONS
-- ============================================================
CREATE TABLE medications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  prescribed_by   UUID REFERENCES providers(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  dosage          TEXT NOT NULL,
  frequency       TEXT NOT NULL CHECK (frequency IN ('once_daily','twice_daily','three_times','four_times','as_needed')),
  time_of_day     TEXT,
  with_food       TEXT DEFAULT 'any' CHECK (with_food IN ('before','after','any')),
  start_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date        DATE,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused','cancelled')),
  side_effects    TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDICINE LOGS (adherence tracking)
-- ============================================================
CREATE TABLE medicine_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id   UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  taken_at        TIMESTAMPTZ DEFAULT NOW(),
  status          TEXT DEFAULT 'taken' CHECK (status IN ('taken','missed','skipped')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MENTAL HEALTH LOGS (mood / wellness entries)
-- ============================================================
CREATE TABLE mental_health_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood            TEXT NOT NULL CHECK (mood IN ('very_low','low','neutral','good','very_good')),
  energy          INTEGER CHECK (energy >= 1 AND energy <= 10),
  anxiety         INTEGER CHECK (anxiety >= 1 AND anxiety <= 10),
  sleep_hours     NUMERIC(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  note            TEXT,
  tags            TEXT[] DEFAULT '{}',
  factors         JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  type            TEXT DEFAULT 'message' CHECK (type IN ('appointment','medication','alert','message','report','crisis','system')),
  read            BOOLEAN DEFAULT FALSE,
  data            JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHAT SESSIONS
-- ============================================================
CREATE TABLE chat_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT,
  session_type    TEXT DEFAULT 'ai_assistant' CHECK (session_type IN ('ai_assistant','provider_chat','support_group')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE TABLE chat_messages (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id          UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  parent_message_id   UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  role                TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content             TEXT NOT NULL,
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
CREATE TABLE emergency_contacts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  relationship    TEXT NOT NULL,
  is_primary      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
