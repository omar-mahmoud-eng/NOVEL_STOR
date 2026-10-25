import { MedusaService } from "@medusajs/framework/utils"
import { Author } from "./models/author"
import { Narrator } from "./models/narrator"
import { StoryMetadata } from "./models/story-metadata"
import { DigitalMedia } from "./models/digital-media"

export class StoryModuleService extends MedusaService({
  Author,
  Narrator,
  StoryMetadata,
  DigitalMedia,
}) {
  /**
   * Retrieves complete rich story details including assigned author, voice narrator,
   * and all public/sample previews.
   */
  async getStoryWithContributors(storyMetadataId: string) {
    const metadata = await (this as any).retrieveStoryMetadata(storyMetadataId)
    let author = null
    let narrator = null

    if (metadata.author_id) {
      try {
        author = await (this as any).retrieveAuthor(metadata.author_id)
      } catch {
        author = null
      }
    }

    if (metadata.narrator_id) {
      try {
        narrator = await (this as any).retrieveNarrator(metadata.narrator_id)
      } catch {
        narrator = null
      }
    }

    const digitalMediaList = await (this as any).listDigitalMedias({
      story_metadata_id: storyMetadataId,
    })

    return {
      ...metadata,
      author,
      narrator,
      media_chapters: digitalMediaList,
    }
  }

  /**
   * Lists free preview sample media items (Sample Chapter PDF or 2-minute Audio Preview)
   * which do not require authentication or DRM keys.
   */
  async getPublicSamples(storyMetadataId: string) {
    return await (this as any).listDigitalMedias({
      story_metadata_id: storyMetadataId,
      is_sample: true,
    })
  }
}

export default StoryModuleService
