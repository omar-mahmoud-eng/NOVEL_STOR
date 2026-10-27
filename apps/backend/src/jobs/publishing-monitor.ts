import type{MedusaContainer}from"@medusajs/framework/types"
import{monitorPublishing}from"../utils/publishing-alerts"
export default async function run(container:MedusaContainer){await monitorPublishing(container)}
export const config={name:"publishing-health-monitor",schedule:"*/5 * * * *"}
