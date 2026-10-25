"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20261025080404 = void 0;
const { Migration } = require("@medusajs/framework/mikro-orm/migrations");

class Migration20261025080404 extends Migration {
  async up() {
    this.addSql(`alter table if exists "fulfillment_tracking" drop constraint if exists "fulfillment_tracking_order_id_unique";`);
    this.addSql(`create table if not exists "fulfillment_tracking" ("id" text not null, "order_id" text not null, "tracking_number" text not null, "carrier" text not null, "status" text check ("status" in ('pending', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'failed')) not null default 'pending', "estimated_delivery_date" timestamptz null, "tracking_events" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_tracking_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_fulfillment_tracking_order_id_unique" ON "fulfillment_tracking" ("order_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fulfillment_tracking_deleted_at" ON "fulfillment_tracking" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  async down() {
    this.addSql(`drop table if exists "fulfillment_tracking" cascade;`);
  }
}
exports.Migration20261025080404 = Migration20261025080404;
