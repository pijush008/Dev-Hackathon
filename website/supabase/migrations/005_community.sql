-- CareCompass: Community & Support Groups
-- ============================================================

-- ============================================================
-- GROUPS
-- ============================================================
CREATE TABLE groups (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT CHECK (category IN ('anxiety','depression','grief','addiction','chronic_pain','caregivers','general','other')),
  image_url       TEXT,
  is_public       BOOLEAN DEFAULT TRUE,
  max_members     INTEGER DEFAULT 100,
  created_by      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GROUP MEMBERS
-- ============================================================
CREATE TABLE group_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id        UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            TEXT DEFAULT 'member' CHECK (role IN ('admin','moderator','member')),
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','pending','banned')),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ============================================================
-- GROUP MESSAGES
-- ============================================================
CREATE TABLE group_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id        UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_pinned       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GROUP MESSAGE REACTIONS
-- ============================================================
CREATE TABLE group_message_reactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id      UUID NOT NULL REFERENCES group_messages(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji           TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_message_reactions ENABLE ROW LEVEL SECURITY;

-- Groups: public groups readable by all, private by members only
CREATE POLICY "Anyone can view public groups"
  ON groups FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Members can view private groups"
  ON groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = groups.id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Group admins can update groups"
  ON groups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'admin'
    )
  );

-- Group Members
CREATE POLICY "Users can view members of accessible groups"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

CREATE POLICY "Users can join public groups"
  ON group_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  USING (user_id = auth.uid());

-- Group Messages
CREATE POLICY "Members can view group messages"
  ON group_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Members can send group messages"
  ON group_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Reactions
CREATE POLICY "Members can view reactions"
  ON group_message_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      JOIN group_messages gmsg ON gmsg.group_id = gm.group_id
      WHERE gmsg.id = group_message_reactions.message_id AND gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

CREATE POLICY "Members can add reactions"
  ON group_message_reactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Members can remove own reactions"
  ON group_message_reactions FOR DELETE
  USING (user_id = auth.uid());
