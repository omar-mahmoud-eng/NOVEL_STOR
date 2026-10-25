import { model } from "@medusajs/framework/utils"

export const Author = model.define("author", {
  id: model.id().primaryKey(),
  name: model.text(),
  bio: model.text().nullable(),
  avatar_url: model.text().nullable(),
  royalty_percentage: model.number().default(0),
  metadata: model.json().nullable(),
})

export default Author
