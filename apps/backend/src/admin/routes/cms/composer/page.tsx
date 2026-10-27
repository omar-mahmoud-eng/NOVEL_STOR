import React from "react"
import {defineRouteConfig}from"@medusajs/admin-sdk"
import {FileText}from"lucide-react"
import {ArticleEditor}from"../../../components/article-editor"
export default function Page(){return <ArticleEditor />}
export const config=defineRouteConfig({label:"محرر المقالات",icon:FileText})
