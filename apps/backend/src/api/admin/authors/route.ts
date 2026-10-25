import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { STORY_MODULE } from "../../../modules/story"

const CreateAuthorSchema = z.object({
  name: z.string().min(2, "Author name is required").max(120),
  bio: z.string().max(2000).optional(),
  avatar_url: z.string().url().optional(),
  royalty_percentage: z.number().min(0).max(100).default(15),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storyService = req.scope.resolve(STORY_MODULE) as any
  const authors = await storyService.listAuthors({})

  return res.status(200).json({
    authors,
    count: authors.length,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const storyService = req.scope.resolve(STORY_MODULE) as any

  try {
    const validated = CreateAuthorSchema.parse(req.body)
    const [author] = await storyService.createAuthors([validated])

    return res.status(201).json({
      author,
    })
  } catch (error: any) {
    return res.status(400).json({
      code: "INVALID_AUTHOR_DATA",
      message: error.message || "Failed creating author record",
    })
  }
}
