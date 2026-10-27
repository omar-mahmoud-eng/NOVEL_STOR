import { Module } from "@medusajs/framework/utils"
import { StoryModuleService } from "./service"
import readingContentLoader from "./loaders/reading-content"

export const STORY_MODULE = "storyModuleService"

export default Module(STORY_MODULE, {
  service: StoryModuleService,
  loaders:[readingContentLoader],
})
