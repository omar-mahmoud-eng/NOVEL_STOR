import type { MedusaContainer } from "@medusajs/framework/types"
import subscriptionRenewalCronHandler from "../subscribers/subscription-renewal-cron"

export default async function subscriptionRenewals(container: MedusaContainer) {
  await subscriptionRenewalCronHandler({ container } as any)
}

export const config = { name: "subscription-renewals", schedule: "0 * * * *" }
