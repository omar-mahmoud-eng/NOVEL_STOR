import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261025080355 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "subscription_tier" drop constraint if exists "subscription_tier_handle_unique";`);
    this.addSql(`create table if not exists "subscription_tier" ("id" text not null, "title" text not null, "handle" text not null, "description" text null, "interval" text check ("interval" in ('month', 'year')) not null default 'month', "price_amount" integer not null, "currency_code" text not null default 'sar', "book_credits_per_period" integer not null default 1, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_tier_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_subscription_tier_handle_unique" ON "subscription_tier" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_tier_deleted_at" ON "subscription_tier" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "user_subscription" ("id" text not null, "customer_id" text not null, "tier_id" text not null, "status" text check ("status" in ('active', 'past_due', 'cancelled', 'paused', 'expired')) not null default 'active', "current_period_start" timestamptz not null, "current_period_end" timestamptz not null, "cancel_at_period_end" boolean not null default false, "remaining_credits" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_subscription_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_subscription_deleted_at" ON "user_subscription" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "subscription_tier" cascade;`);

    this.addSql(`drop table if exists "user_subscription" cascade;`);
  }

}
