import React from "react"
import {defineRouteConfig}from"@medusajs/admin-sdk"
import {Users}from"lucide-react"
import {ContributorEditor}from"../../components/contributor-editor"
export default function Page(){return <ContributorEditor />}
export const config=defineRouteConfig({label:"المؤلفون والرواة",icon:Users})
