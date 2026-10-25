import { Module } from "@medusajs/framework/utils"
import { StoryModuleService } from "./service"

export const STORY_MODULE = "storyModuleService"

export default Module(STORY_MODULE, {
  service: StoryModuleService,
})
