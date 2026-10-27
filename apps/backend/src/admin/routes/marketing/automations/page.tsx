import React from "react"
import{defineRouteConfig}from"@medusajs/admin-sdk"
import{DefinitionEditor}from"../../../components/definition-editor"
export default function Page(){return <DefinitionEditor kind="automations" title="مسودات مسارات الأتمتة"/>}
export const config=defineRouteConfig({label:"Automations"})
