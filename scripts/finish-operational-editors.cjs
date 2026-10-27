const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');function write(p,s){const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s)}
// Replace simulated executive actions with persisted metrics and actual navigation.
write('apps/backend/src/admin/routes/command-center/page.tsx',`import React from "react"
import {defineRouteConfig} from "@medusajs/admin-sdk"
import {LayoutDashboard} from "lucide-react"
import {LiveAnalytics} from "../../components/live-analytics"
import {Container,Heading} from "@medusajs/ui"
const departments=[["reading-stories","إدارة محتوى المنصات"],["products","المنتجات والأسعار والملفات"],["authors-narrators","المؤلفون والرواة"],["cms","المقالات"],["helpdesk/inbox","صندوق الدعم"],["marketing","الحملات"],["reviews/moderation","مراجعة التقييمات"],["loyalty","حسابات الولاء"],["affiliates","الشركاء"],["warehouse","المخزون"],["subscriptions/plans","خطط الاشتراك"],["crm","العملاء"]]
export default function Page(){return <div><Container className="p-6 space-y-4" dir="rtl"><Heading level="h1">غرفة القيادة والتحكم</Heading><nav className="grid sm:grid-cols-3 gap-4">{departments.map(([path,label])=><a className="border rounded-lg p-4 hover:bg-ui-bg-subtle" key={path} href={"/app/"+path}>{label} ←</a>)}</nav></Container><LiveAnalytics/></div>}
export const config=defineRouteConfig({label:"Executive Overview",icon:LayoutDashboard})
`);
// Export the actual ledger without claiming that a bank transfer happened.
let p='apps/backend/src/admin/routes/affiliates/payouts/page.tsx',s=fs.readFileSync(path.join(root,p),'utf8');
s=s.replace(/  const handleBatchPay = \(\) => \{[\s\S]*?\n  \}\n/,`  const handleBatchPay = () => {
    const cell=(value:any)=>'"'+String(value??"").replace(/^[=+@-]/," '").replaceAll('"','""')+'"'
    const rows=[["Order","Affiliate","Amount","Commission","Status"],...pendingPayouts.map(r=>[r.order_id,r.affiliate_name||r.affiliate_id,r.order_amount,r.commission_amount,r.payout_status||r.status])]
    const url=URL.createObjectURL(new Blob(["\\ufeff"+rows.map(row=>row.map(cell).join(",")).join("\\r\\n")],{type:"text/csv;charset=utf-8"}));const anchor=document.createElement("a");anchor.href=url;anchor.download="pending-commissions.csv";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMsg("تم تنزيل كشف المراجعة. الدفع مؤجل ولم يُنفذ تحويل.")
  }
`);
s=s.replaceAll('r.payout_status !== "paid"','(r.payout_status || r.status) !== "paid"').replaceAll('r.payout_status === "paid"','(r.payout_status || r.status) === "paid"').replaceAll('ref.payout_status === "paid"','(ref.payout_status || ref.status) === "paid"').replace('{processing ? "جاري تحويل الدفعات..." : `صرف مستحقات المعلقين ($${totalPendingAmount.toFixed(2)})`}','{`تنزيل كشف المستحقات (${pendingPayouts.length})`}');write(p,s);
// Prevent the legacy provisioning command from destroying real records.
p='provision-all-in-one-tables.cjs';s=fs.readFileSync(path.join(root,p),'utf8');s=s.replace('  await client.query(`\n    TRUNCATE', '  if (process.env.ALLOW_DESTRUCTIVE_DEMO_RESET !== "true" || process.env.NODE_ENV === "production") {\n    console.log("Schema prepared. Demo reset and fabricated business metrics skipped.");\n    await client.end(); return;\n  }\n  await client.query(`\n    TRUNCATE');write(p,s);
