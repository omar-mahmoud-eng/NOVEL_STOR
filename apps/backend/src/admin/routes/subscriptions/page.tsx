import React from "react"
import{defineRouteConfig}from"@medusajs/admin-sdk"
import{SubscriberManager}from"../../components/subscriber-manager"
export default function Page(){return <SubscriberManager/>}
export const config=defineRouteConfig({label:"Subscriptions"})
