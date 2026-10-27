import React from "react"
import {defineRouteConfig} from "@medusajs/admin-sdk"
import {LayoutDashboard} from "lucide-react"
import {LiveAnalytics} from "../../components/live-analytics"
import {Container,Heading} from "@medusajs/ui"
const departments=[["reading-stories","إدارة محتوى المنصات"],["products","المنتجات والأسعار والملفات"],["authors-narrators","المؤلفون والرواة"],["cms","المقالات"],["helpdesk/inbox","صندوق الدعم"],["marketing","الحملات"],["reviews/moderation","مراجعة التقييمات"],["loyalty","حسابات الولاء"],["affiliates","الشركاء"],["warehouse","المخزون"],["subscriptions/plans","خطط الاشتراك"],["crm","العملاء"]]
export default function Page(){return <div><Container className="p-6 space-y-4" dir="rtl"><Heading level="h1">غرفة القيادة والتحكم</Heading><nav className="grid sm:grid-cols-3 gap-4">{departments.map(([path,label])=><a className="border rounded-lg p-4 hover:bg-ui-bg-subtle" key={path} href={"/app/"+path}>{label} ←</a>)}</nav></Container><LiveAnalytics/></div>}
export const config=defineRouteConfig({label:"Executive Overview",icon:LayoutDashboard})
