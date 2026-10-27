import React from "react"
import{defineRouteConfig}from"@medusajs/admin-sdk"
import{PlanEditor}from"../../../components/plan-editor"
export default function Page(){return <PlanEditor/>}
export const config=defineRouteConfig({label:"خطط الاشتراك"})
