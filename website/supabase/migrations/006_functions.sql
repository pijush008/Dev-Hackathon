-- CareCompass: Functions, Triggers, and Indexes
-- ============================================================

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_safety_plans_updated_at
  BEFORE UPDATE ON safety_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- UPDATE PROVIDER RATING AVG ON REVIEW INSERT/UPDATE/DELETE
-- ============================================================
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers SET
    rating_avg = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM provider_reviews WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)), 0),
    rating_count = (SELECT COUNT(*)::INTEGER FROM provider_reviews WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id))
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_provider_review_change
  AFTER INSERT OR UPDATE OR DELETE ON provider_reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- ============================================================
-- AUTO-ACTIVATE SINGLE SAFETY PLAN
-- ============================================================
CREATE OR REPLACE FUNCTION deactivate_other_safety_plans()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = TRUE THEN
    UPDATE safety_plans
    SET is_active = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_active = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_safety_plan_activated
  BEFORE INSERT OR UPDATE ON safety_plans
  FOR EACH ROW EXECUTE FUNCTION deactivate_other_safety_plans();

-- ============================================================
-- INDEXES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_full_name ON profiles(full_name);
CREATE INDEX idx_profiles_city ON profiles(city);

-- Patients
CREATE INDEX idx_patients_profile_id ON patients(profile_id);
CREATE INDEX idx_patients_status ON patients(status);

-- Providers
CREATE INDEX idx_providers_name ON providers(name);
CREATE INDEX idx_providers_specialties ON providers USING GIN(specialties);
CREATE INDEX idx_providers_provider_type ON providers(provider_type);
CREATE INDEX idx_providers_languages ON providers USING GIN(languages);
CREATE INDEX idx_providers_location ON providers(lat, lng);
CREATE INDEX idx_providers_is_verified ON providers(is_verified);

-- Appointments
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Medical Reports
CREATE INDEX idx_medical_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX idx_medical_reports_report_date ON medical_reports(report_date);

-- Medications
CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_medications_status ON medications(status);

-- Medicine Logs
CREATE INDEX idx_medicine_logs_medication_id ON medicine_logs(medication_id);
CREATE INDEX idx_medicine_logs_taken_at ON medicine_logs(taken_at);
CREATE INDEX idx_medicine_logs_status ON medicine_logs(status);

-- Mental Health Logs
CREATE INDEX idx_mental_health_logs_user_id ON mental_health_logs(user_id);
CREATE INDEX idx_mental_health_logs_created_at ON mental_health_logs(created_at);
CREATE INDEX idx_mental_health_logs_mood ON mental_health_logs(mood);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Chat Sessions
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_session_type ON chat_sessions(session_type);

-- Chat Messages
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Emergency Contacts
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);

-- Safety Plans
CREATE INDEX idx_safety_plans_user_id ON safety_plans(user_id);
CREATE INDEX idx_safety_plans_is_active ON safety_plans(is_active);

-- Crisis Resources
CREATE INDEX idx_crisis_resources_country ON crisis_resources(country);
CREATE INDEX idx_crisis_resources_is_active ON crisis_resources(is_active);

-- Crisis Alerts
CREATE INDEX idx_crisis_alerts_user_id ON crisis_alerts(user_id);
CREATE INDEX idx_crisis_alerts_risk_level ON crisis_alerts(risk_level);
CREATE INDEX idx_crisis_alerts_created_at ON crisis_alerts(created_at);

-- Provider Reviews
CREATE INDEX idx_provider_reviews_provider_id ON provider_reviews(provider_id);
CREATE INDEX idx_provider_reviews_user_id ON provider_reviews(user_id);

-- Provider Availability
CREATE INDEX idx_provider_availability_provider_id ON provider_availability(provider_id);
CREATE INDEX idx_provider_availability_day_of_week ON provider_availability(day_of_week);

-- Groups
CREATE INDEX idx_groups_category ON groups(category);
CREATE INDEX idx_groups_is_public ON groups(is_public);
CREATE INDEX idx_groups_created_by ON groups(created_by);

-- Group Members
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);

-- Group Messages
CREATE INDEX idx_group_messages_group_id ON group_messages(group_id);
CREATE INDEX idx_group_messages_user_id ON group_messages(user_id);
CREATE INDEX idx_group_messages_created_at ON group_messages(created_at);

-- Group Message Reactions
CREATE INDEX idx_group_message_reactions_message_id ON group_message_reactions(message_id);
