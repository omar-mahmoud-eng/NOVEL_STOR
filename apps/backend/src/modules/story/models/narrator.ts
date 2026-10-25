import { model } from "@medusajs/framework/utils"

export const Narrator = model.define("narrator", {
  id: model.id().primaryKey(),
  name: model.text(),
  bio: model.text().nullable(),
  avatar_url: model.text().nullable(),
  sample_voice_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Narrator
