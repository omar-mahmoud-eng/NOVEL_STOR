export const publishingSchema = `
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS workflow_state text;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS published_snapshot jsonb;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS published_revision integer;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS review_note text;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS reviewed_by text;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS submitted_at timestamptz;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE reading_stories ADD COLUMN IF NOT EXISTS published_at timestamptz;
CREATE TABLE IF NOT EXISTS publishing_roles (
 user_id text PRIMARY KEY, role text NOT NULL CHECK(role IN ('admin','publisher','editor','support','warehouse','analyst')),
 assigned_by text, updated_at timestamptz NOT NULL DEFAULT now()
);
-- Serialize native user retirement with role changes as well as checking it
-- in HTTP middleware. A concurrent promotion must not leave zero active admins.
CREATE OR REPLACE FUNCTION publishing_guard_staff_retirement() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL) THEN
  PERFORM pg_advisory_xact_lock(hashtext('storyverse.staff-roles'));
  IF EXISTS(SELECT 1 FROM publishing_roles WHERE user_id=OLD.id AND role='admin') THEN
   RAISE EXCEPTION 'Demote administrator before deleting the account' USING ERRCODE='42501';
  END IF;
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS publishing_staff_retirement ON "user";
CREATE TRIGGER publishing_staff_retirement BEFORE UPDATE OF deleted_at OR DELETE ON "user" FOR EACH ROW EXECUTE FUNCTION publishing_guard_staff_retirement();
CREATE TABLE IF NOT EXISTS publishing_audit (
 id text PRIMARY KEY, actor_id text NOT NULL, actor_role text NOT NULL, method text NOT NULL,
 path text NOT NULL, resource text NOT NULL, http_status integer, detail jsonb NOT NULL DEFAULT '{}',
 created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS publishing_audit_time ON publishing_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS publishing_audit_actor ON publishing_audit(actor_id,created_at DESC);
CREATE TABLE IF NOT EXISTS reading_story_versions (
 id text PRIMARY KEY, story_id text NOT NULL REFERENCES reading_stories(id) ON DELETE CASCADE, revision integer NOT NULL,
 snapshot jsonb NOT NULL, action text NOT NULL, actor_id text, note text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(story_id,revision)
);
CREATE TABLE IF NOT EXISTS reader_profiles (
 id text PRIMARY KEY, customer_id text NOT NULL, name text NOT NULL, realm text NOT NULL CHECK(realm IN ('little','kids','teens')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS reader_profiles_owner ON reader_profiles(customer_id) WHERE deleted_at IS NULL;
ALTER TABLE reader_profiles ADD COLUMN IF NOT EXISTS settings jsonb NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS customer_stepups (
 token_hash text PRIMARY KEY, customer_id text NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reader_states (
 customer_id text NOT NULL, profile_id text NOT NULL DEFAULT '', data jsonb NOT NULL DEFAULT '{}',
 revision integer NOT NULL DEFAULT 0, analytics_opt_in boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(customer_id,profile_id)
);
CREATE TABLE IF NOT EXISTS reading_events (
 id text PRIMARY KEY, customer_id text NOT NULL, profile_id text NOT NULL DEFAULT '', story_id text NOT NULL,
 realm text NOT NULL, kind text NOT NULL CHECK(kind IN ('progress','completed','saved','unsaved')),
 page integer, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reading_events_period ON reading_events(created_at,realm,story_id);
CREATE INDEX IF NOT EXISTS reading_events_customer ON reading_events(customer_id,created_at DESC);
CREATE TABLE IF NOT EXISTS publishing_alerts (
 id text PRIMARY KEY, fingerprint text NOT NULL UNIQUE, kind text NOT NULL, severity text NOT NULL,
 title text NOT NULL, message text NOT NULL, resource_url text, occurrences integer NOT NULL DEFAULT 1,
 resolved_at timestamptz, acknowledged_by text, acknowledged_at timestamptz,
 first_seen_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS media_upload_sessions (
 id text PRIMARY KEY, actor_id text NOT NULL, filename text NOT NULL, mime_type text NOT NULL,
 total_bytes bigint NOT NULL, part_size integer NOT NULL, storage_key text NOT NULL UNIQUE,
 upload_id text NOT NULL, status text NOT NULL DEFAULT 'uploading' CHECK(status IN ('uploading','completed','aborted')),
 product_id text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT now()+interval '24 hours'
);
CREATE TABLE IF NOT EXISTS media_upload_parts (
 session_id text NOT NULL REFERENCES media_upload_sessions(id) ON DELETE CASCADE,
 part_number integer NOT NULL, etag text NOT NULL, checksum text NOT NULL, bytes integer NOT NULL,
 PRIMARY KEY(session_id,part_number)
);
CREATE OR REPLACE FUNCTION publishing_purge_reader_account() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' OR (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL) THEN
  DELETE FROM reading_events WHERE customer_id=OLD.id;
  DELETE FROM reader_states WHERE customer_id=OLD.id;
  DELETE FROM reader_profiles WHERE customer_id=OLD.id;
  DELETE FROM customer_stepups WHERE customer_id=OLD.id;
 END IF;
 RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS publishing_reader_retirement ON customer;
CREATE TRIGGER publishing_reader_retirement AFTER UPDATE OF deleted_at OR DELETE ON customer FOR EACH ROW EXECUTE FUNCTION publishing_purge_reader_account();
`

export const backfillPublishedSnapshots = `UPDATE reading_stories r SET workflow_state=r.status,
 published_revision=CASE WHEN status='published' THEN revision END,
 published_at=CASE WHEN status='published' THEN updated_at END,
 published_snapshot=CASE WHEN status='published' THEN jsonb_build_object('id',id,'handle',handle,'title',title,'realm',realm,'status','published','data',data,'product_id',product_id,'revision',revision) END
 WHERE workflow_state IS NULL`
