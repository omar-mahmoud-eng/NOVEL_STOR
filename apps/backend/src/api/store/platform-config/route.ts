import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{mailConfigured}from"../../../utils/mail"
export function GET(_req:MedusaRequest,res:MedusaResponse){return res.json({password_reset:mailConfigured(),mail_delivery_mode:process.env.MAIL_DELIVERY_MODE==="external"?"external":"local",payment_enabled:false,reading_source:"database"})}
