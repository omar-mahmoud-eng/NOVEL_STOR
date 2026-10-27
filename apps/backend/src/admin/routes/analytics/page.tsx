import React from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BarChart3,Truck,DollarSign } from "lucide-react"
import { LiveAnalytics } from "../../components/live-analytics"
export default function Page(){return <LiveAnalytics mode="overview"/>}
export const config = defineRouteConfig({
  label: "Financial & Logistics Analytics",
  icon: BarChart3,
})
