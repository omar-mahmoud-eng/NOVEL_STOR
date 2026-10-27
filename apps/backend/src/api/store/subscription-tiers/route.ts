import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{SUBSCRIPTION_MODULE}from"../../../modules/subscription"
export async function GET(req:MedusaRequest,res:MedusaResponse){const tiers=await(req.scope.resolve(SUBSCRIPTION_MODULE)as any).listSubscriptionTiers({is_active:true},{take:100});return res.json({tiers,payment_enabled:false,price_unit:"minor"})}
