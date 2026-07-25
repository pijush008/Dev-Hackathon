-- CareCompass: Row-Level Security Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- PATIENTS
-- ============================================================
CREATE POLICY "Users can view own patient record"
  ON patients FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own patient record"
  ON patients FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own patient record"
  ON patients FOR UPDATE
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete own patient record"
  ON patients FOR DELETE
  USING (profile_id = auth.uid());

-- ============================================================
-- PROVIDERS (public read, admin write)
-- ============================================================
CREATE POLICY "Anyone can view verified providers"
  ON providers FOR SELECT
  USING (is_verified = TRUE OR auth.uid() IS NULL);

CREATE POLICY "Providers can update own profile"
  ON providers FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can create own appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

-- ============================================================
-- MEDICAL REPORTS
-- ============================================================
CREATE POLICY "Users can view own medical reports"
  ON medical_reports FOR SELECT
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can upload own medical reports"
  ON medical_reports FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can delete own medical reports"
  ON medical_reports FOR DELETE
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

-- ============================================================
-- MEDICATIONS
-- ============================================================
CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
  );

-- ============================================================
-- MEDICINE LOGS
-- ============================================================
CREATE POLICY "Users can view own medicine logs"
  ON medicine_logs FOR SELECT
  USING (
    medication_id IN (
      SELECT m.id FROM medications m
      JOIN patients p ON p.id = m.patient_id
      WHERE p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own medicine logs"
  ON medicine_logs FOR INSERT
  WITH CHECK (
    medication_id IN (
      SELECT m.id FROM medications m
      JOIN patients p ON p.id = m.patient_id
      WHERE p.profile_id = auth.uid()
    )
  );

-- ============================================================
-- MENTAL HEALTH LOGS
-- ============================================================
CREATE POLICY "Users can view own mental health logs"
  ON mental_health_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own mental health logs"
  ON mental_health_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own mental health logs"
  ON mental_health_logs FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own mental health logs"
  ON mental_health_logs FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- CHAT SESSIONS
-- ============================================================
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own chat sessions"
  ON chat_sessions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE POLICY "Users can view messages in own sessions"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert messages in own sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update messages in own sessions"
  ON chat_messages FOR UPDATE
  USING (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  )
  WITH CHECK (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
CREATE POLICY "Users can view own emergency contacts"
  ON emergency_contacts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own emergency contacts"
  ON emergency_contacts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own emergency contacts"
  ON emergency_contacts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own emergency contacts"
  ON emergency_contacts FOR DELETE
  USING (user_id = auth.uid());
