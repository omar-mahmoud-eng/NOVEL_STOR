// Create operational CRM tables on clean installations without inserting
// fabricated customers, reading activity, credits, or delivery statistics.
export const crmSchema = `
CREATE TABLE IF NOT EXISTS customer_reading_profiles (
 customer_id varchar(64) PRIMARY KEY, preferred_format varchar(32) DEFAULT 'ebook',
 audio_hours_listened numeric(10,2) DEFAULT 0, pages_read integer DEFAULT 0,
 preferred_narration_speed varchar(16) DEFAULT '1x', currently_reading_title varchar(255),
 completed_books_count integer DEFAULT 0, churn_risk_level varchar(16) DEFAULT 'unknown',
 churn_score integer DEFAULT 0, vip_tier varchar(32) DEFAULT 'bronze_reader',
 book_credits_balance integer DEFAULT 0, engagement_score integer DEFAULT 0,
 last_active_at timestamptz, updated_at timestamptz DEFAULT now()
);
ALTER TABLE customer_reading_profiles ALTER COLUMN book_credits_balance SET DEFAULT 0;
ALTER TABLE customer_reading_profiles ALTER COLUMN engagement_score SET DEFAULT 0;
ALTER TABLE customer_reading_profiles ALTER COLUMN churn_score SET DEFAULT 0;
ALTER TABLE customer_reading_profiles ALTER COLUMN vip_tier SET DEFAULT 'bronze_reader';
CREATE TABLE IF NOT EXISTS customer_crm_notes (
 id varchar(64) PRIMARY KEY, customer_id varchar(64) NOT NULL,
 author_name varchar(128) NOT NULL, note_type varchar(32) DEFAULT 'general',
 content text NOT NULL, created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_communications_log (
 id varchar(64) PRIMARY KEY, customer_id varchar(64) NOT NULL, channel varchar(32) NOT NULL,
 template_key varchar(64) NOT NULL, recipient varchar(128) NOT NULL, subject varchar(255),
 message_body text NOT NULL, status varchar(32) DEFAULT 'draft', sent_by varchar(128),
 created_at timestamptz DEFAULT now()
);
ALTER TABLE crm_communications_log ALTER COLUMN status SET DEFAULT 'draft';
CREATE TABLE IF NOT EXISTS crm_audience_segments (
 id varchar(64) PRIMARY KEY, name varchar(128) NOT NULL, name_ar varchar(128) NOT NULL,
 slug varchar(64) NOT NULL UNIQUE, description_ar text, filter_criteria jsonb NOT NULL DEFAULT '{}',
 customer_count integer DEFAULT 0, avg_engagement varchar(16) DEFAULT '0%',
 sync_destination varchar(128) DEFAULT 'غير مربوط', is_active boolean DEFAULT true,
 created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS customer_crm_notes_customer ON customer_crm_notes(customer_id);
CREATE INDEX IF NOT EXISTS crm_communications_customer ON crm_communications_log(customer_id);
`
