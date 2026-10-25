import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261025080337 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "author" ("id" text not null, "name" text not null, "bio" text null, "avatar_url" text null, "royalty_percentage" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "author_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_author_deleted_at" ON "author" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "digital_media" ("id" text not null, "story_metadata_id" text null, "variant_id" text null, "format" text check ("format" in ('ebook_epub', 'ebook_pdf', 'audio_mp3', 'audio_m4b', 'audio_hls')) not null, "title" text not null, "chapter_number" integer not null default 1, "duration_seconds" integer null, "private_storage_key" text not null, "file_size_bytes" integer null, "mime_type" text not null default 'application/octet-stream', "is_sample" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_media_deleted_at" ON "digital_media" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "narrator" ("id" text not null, "name" text not null, "bio" text null, "avatar_url" text null, "sample_voice_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "narrator_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_narrator_deleted_at" ON "narrator" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "story_metadata" ("id" text not null, "age_group" text check ("age_group" in ('kids_3_6', 'kids_7_12', 'teens_13_17', 'adults_18_plus')) not null default 'kids_7_12', "isbn" text null, "language" text not null default 'ar', "page_count" integer null, "audio_duration_seconds" integer null, "publication_date" timestamptz null, "sample_chapter_pdf_url" text null, "sample_audio_url" text null, "author_id" text null, "narrator_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "story_metadata_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_story_metadata_deleted_at" ON "story_metadata" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "author" cascade;`);

    this.addSql(`drop table if exists "digital_media" cascade;`);

    this.addSql(`drop table if exists "narrator" cascade;`);

    this.addSql(`drop table if exists "story_metadata" cascade;`);
  }

}
