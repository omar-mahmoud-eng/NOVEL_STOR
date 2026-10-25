import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { STORY_MODULE } from "../../../modules/story"

const CreateNarratorSchema = z.object({
  name: z.string().min(2, "Narrator name is required").max(120),
  bio: z.string().max(2000).optional(),
  avatar_url: z.string().url().optional(),
  sample_voice_url: z.string().url().optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storyService = req.scope.resolve(STORY_MODULE) as any
  const narrators = await storyService.listNarrators({})

  return res.status(200).json({
    narrators,
    count: narrators.length,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const storyService = req.scope.resolve(STORY_MODULE) as any

  try {
    const validated = CreateNarratorSchema.parse(req.body)
    const [narrator] = await storyService.createNarrators([validated])

    return res.status(201).json({
      narrator,
    })
  } catch (error: any) {
    return res.status(400).json({
      code: "INVALID_NARRATOR_DATA",
      message: error.message || "Failed creating narrator record",
    })
  }
}
