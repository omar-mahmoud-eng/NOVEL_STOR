import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { verifyMediaAccessWorkflow } from "../../../../../workflows/drm/verify-media-access"

const StreamParamsSchema = z.object({
  media_id: z.string().min(1, "media_id is required"),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { media_id } = StreamParamsSchema.parse(req.params)

    // Resolve authenticated customer if present
    const customerId = (req as any).auth_context?.actor_id || (req as any).user?.customer_id

    const { result } = await verifyMediaAccessWorkflow(req.scope).run({
      input: {
        media_id,
        customer_id: customerId,
      },
    })

    return res.status(200).json({
      status: "success",
      stream_payload: result,
    })
  } catch (error: any) {
    const isAuthError =
      error.message?.includes("DRM Access Denied") ||
      error.message?.includes("Authentication required")

    return res.status(isAuthError ? 403 : 400).json({
      code: isAuthError ? "DRM_ACCESS_DENIED" : "STREAM_REQUEST_FAILED",
      message: error.message || "Unable to generate secure playback stream.",
    })
  }
}
