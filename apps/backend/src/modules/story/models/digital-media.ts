import { model } from "@medusajs/framework/utils"

export const MediaFormatEnum = [
  "ebook_epub",
  "ebook_pdf",
  "audio_mp3",
  "audio_m4b",
  "audio_hls",
] as const

export const DigitalMedia = model.define("digital_media", {
  id: model.id().primaryKey(),
  story_metadata_id: model.text().nullable(),
  variant_id: model.text().nullable(),
  format: model.enum([
    "ebook_epub",
    "ebook_pdf",
    "audio_mp3",
    "audio_m4b",
    "audio_hls",
  ]),
  title: model.text(),
  chapter_number: model.number().default(1),
  duration_seconds: model.number().nullable(),
  private_storage_key: model.text(),
  file_size_bytes: model.number().nullable(),
  mime_type: model.text().default("application/octet-stream"),
  is_sample: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default DigitalMedia
