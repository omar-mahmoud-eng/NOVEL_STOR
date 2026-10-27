import "../lib/client-monitor"
import React from "react"
import {defineWidgetConfig}from"@medusajs/admin-sdk"
export default function PublishingShortcut(){return <nav className="flex flex-wrap gap-4 p-4 border rounded" dir="rtl"><a href="/app/publishing-operations">مهام التشغيل</a><a href="/app/publishing">مساحة عمل النشر</a><a href="/app/reading-reports">تقارير القراءة</a></nav>}
export const config=defineWidgetConfig({zone:["order.list.before","product.list.before"]})
