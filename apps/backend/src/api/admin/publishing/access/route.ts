import type { MedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { accessOf } from "../../../../utils/publishing-access"
export function GET(req:MedusaRequest,res:MedusaResponse){res.setHeader("Cache-Control","no-store");return res.json({access:accessOf(req)})}
