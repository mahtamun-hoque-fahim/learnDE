-- ===========================================================================
-- LearnDE migration v2: add users.last_active_at
-- Tracks real user activity for the admin "Active This Week" stat.
-- Safe to run on the current DB (additive, no drops).
-- Run in Neon SQL Editor.
-- ===========================================================================

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_active_at" timestamp with time zone;
CREATE INDEX IF NOT EXISTS "users_last_active_at_idx" ON "users" USING btree ("last_active_at");

-- Backfill: seed last_active_at from the most recent session each user has.
-- For users who've never had a session, last_active_at stays NULL (inactive).
UPDATE users u
SET last_active_at = s.last_seen
FROM (
  SELECT user_id, MAX(updated_at) AS last_seen
  FROM sessions
  GROUP BY user_id
) s
WHERE u.id = s.user_id
  AND u.last_active_at IS NULL;

-- Verify
SELECT id, email, role, last_active_at FROM users ORDER BY last_active_at DESC NULLS LAST;
