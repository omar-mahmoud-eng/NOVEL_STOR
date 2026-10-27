import React from "react"
import{defineRouteConfig}from"@medusajs/admin-sdk"
import{DefinitionEditor}from"../../../components/definition-editor"
export default function Page(){return <DefinitionEditor kind="rewards" title="تعريفات المكافآت"/>}
export const config=defineRouteConfig({label:"Rewards Catalog"})
