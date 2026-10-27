import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{z}from"zod"
import{recordClientError}from"../../../utils/publishing-alerts"
export async function POST(req:MedusaRequest,res:MedusaResponse){const body=z.object({message:z.string().max(1200),path:z.string().max(500).startsWith("/")}).safeParse(req.body);if(!body.success)return res.status(400).json({message:"Invalid event"});await recordClientError({...body.data,source:"storefront"});return res.status(202).json({accepted:true})}
