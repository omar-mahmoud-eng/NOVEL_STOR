import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import StoryModule from "../modules/story"

export default defineLink(
  ProductModule.linkable.product,
  StoryModule.linkable.storyMetadata
)
