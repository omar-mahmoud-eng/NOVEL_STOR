import { model } from "@medusajs/framework/utils"

export const AgeGroupEnum = [
  "kids_3_6",
  "kids_7_12",
  "teens_13_17",
  "adults_18_plus",
] as const

export const StoryMetadata = model.define("story_metadata", {
  id: model.id().primaryKey(),
  age_group: model
    .enum(["kids_3_6", "kids_7_12", "teens_13_17", "adults_18_plus"])
    .default("kids_7_12"),
  isbn: model.text().nullable(),
  language: model.text().default("ar"),
  page_count: model.number().nullable(),
  audio_duration_seconds: model.number().nullable(),
  publication_date: model.dateTime().nullable(),
  sample_chapter_pdf_url: model.text().nullable(),
  sample_audio_url: model.text().nullable(),
  author_id: model.text().nullable(),
  narrator_id: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default StoryMetadata
