import React from "react"
import{defineRouteConfig}from"@medusajs/admin-sdk"
import{DefinitionEditor}from"../../../components/definition-editor"
export default function Page(){return <DefinitionEditor kind="canned-replies" title="مكتبة الردود الجاهزة"/>}
export const config=defineRouteConfig({label:"Canned Replies"})
