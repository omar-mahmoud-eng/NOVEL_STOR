import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { randomUUID } from "node:crypto"
import { getDbPool } from "./db"

export const rolePermissions: Record<string,string[]> = {
 admin: ["*"],
 publisher: ["content.read","content.edit","content.review","content.publish","catalog.read","catalog.write","media.read","media.write","reports.read"],
 editor: ["content.read","content.edit","catalog.read","media.read","media.write"],
 support: ["orders.read","drafts.write","readers.read","support.read","support.write","catalog.read","inventory.read"],
 warehouse: ["orders.read","inventory.read","inventory.write","catalog.read"],
 analyst: ["reports.read","catalog.read"],
}
export type PublishingAccess={user_id:string;role:string;permissions:string[]}
export function can(access:PublishingAccess|undefined,permission:string){return Boolean(access&&(access.permissions.includes("*")||access.permissions.includes(permission)))}
export function accessOf(req:MedusaRequest){return (req as any).publishing_access as PublishingAccess|undefined}
export function requirePermission(req:MedusaRequest,permission:string){if(!can(accessOf(req),permission))throw Object.assign(new Error("ليس لديك صلاحية تنفيذ هذا الإجراء"),{status:403})}

export function permissionFor(path:string,method:string):string {
 const read=method==="GET"||method==="HEAD",p=path.split("?")[0].replace(/\/$/,"")
 if(/^\/admin\/(users\/me|plugins|feature-flags|locales|currencies|store|stores|regions|sales-channels|shipping-profiles|product-tags|product-categories|product-types)(?:\/|$)/.test(p)&&read)return "session.read"
 if(p==="/admin/users/me")return "session.read"
 if(p==="/admin/publishing/access")return "session.read"
 if(p==="/admin/publishing/overview")return "session.read"
 if(p==="/admin/publishing/client-events")return "session.read"
 if(/^\/admin\/publishing\/(roles|audit)(?:\/|$)/.test(p))return "staff.manage"
 if(/^\/admin\/publishing\/readers(?:\/|$)/.test(p))return "readers.read"
 if(/^\/admin\/publishing\/(reports|alerts)(?:\/|$)/.test(p))return "reports.read"
 if(/^\/admin\/publishing\/books(?:\/|$)/.test(p))return read?"content.read":"content.edit"
 if(/^\/admin\/assets(?:\/|$)/.test(p)||/^\/admin\/story-media/.test(p))return read?"media.read":"media.write"
 if(/^\/admin\/uploads(?:\/|$)/.test(p))return read?"media.read":"content.publish"
 if(/^\/admin\/products\/[^/]+\/story-media$/.test(p))return read?"media.read":"media.write"
 if(/^\/admin\/(reading-stories|cms|authors|narrators)(?:\/|$)/.test(p))return read?"content.read":"content.edit"
 if(/^\/admin\/(products|collections|price-lists|pricing|uploads|product-tags|product-categories|product-types)(?:\/|$)/.test(p))return read?"catalog.read":"catalog.write"
 if(/^\/admin\/draft-orders(?:\/|$)/.test(p))return read?"orders.read":"drafts.write"
 if(/^\/admin\/orders(?:\/|$)/.test(p)){if(!read&&/\/fulfillments(?:\/|$)/.test(p))return "inventory.write";return read?"orders.read":"orders.write"}
 if(/^\/admin\/(inventory-items|stock-locations|reservations|fulfillments|shipping-options|fulfillment-providers|warehouse)(?:\/|$)/.test(p))return read?"inventory.read":"inventory.write"
 if(/^\/admin\/(helpdesk|operational-definitions\/canned-replies)(?:\/|$)/.test(p))return read?"support.read":"support.write"
 if(/^\/admin\/(customers|customer-groups|crm)(?:\/|$)/.test(p))return read?"readers.read":"readers.write"
 if(/^\/admin\/(operations-analytics|command-center|marketing|reviews|loyalty|affiliates)(?:\/|$)/.test(p))return read?"reports.read":"operations.write"
 return "admin.manage"
}

async function resolveAccess(id:string):Promise<PublishingAccess>{
 const pool=getDbPool()
 // Select the explicitly configured owner (or oldest active user on installs
 // without ADMIN_EMAIL), never whoever happens to make the first request.
 await pool.query(`INSERT INTO publishing_roles(user_id,role,assigned_by)
 SELECT id,'admin',id FROM "user" WHERE deleted_at IS NULL
 AND ($1::text IS NULL OR lower(email)=lower($1)) ORDER BY created_at,id LIMIT 1
 ON CONFLICT(user_id) DO NOTHING`,[process.env.ADMIN_EMAIL||null])
 const user=await pool.query(`SELECT u.id,COALESCE(r.role,'editor') AS role FROM "user" u LEFT JOIN publishing_roles r ON r.user_id=u.id WHERE u.id=$1 AND u.deleted_at IS NULL`,[id])
 if(!user.rowCount)throw Object.assign(new Error("Administrator account not found"),{status:401})
 const role=user.rows[0].role;return {user_id:id,role,permissions:["session.read",...(rolePermissions[role]||[])]}
}

export async function publishingAccessMiddleware(req:MedusaRequest,res:MedusaResponse,next:MedusaNextFunction){
 try{
  const id=(req as any).auth_context?.actor_id||(req as any).secret_key_context?.created_by
  if(!id)return res.status(401).json({message:"Administrator authentication required"})
  const access=await resolveAccess(id);(req as any).publishing_access=access
  const path=req.originalUrl.split("?")[0],permission=permissionFor(path,req.method)
  if(!can(access,permission))return res.status(403).json({code:"PERMISSION_DENIED",message:"ليس لديك صلاحية الوصول إلى هذا القسم",permission})
  if(req.method==="DELETE"&&/^\/admin\/users\/[^/]+$/.test(path)){
   const target=decodeURIComponent(path.split("/").pop()!)
   const last=await getDbPool().query(`SELECT 1 FROM publishing_roles WHERE user_id=$1 AND role='admin'`,[target])
   if(last.rowCount)return res.status(409).json({message:"انقل صلاحية المدير من إدارة الأدوار قبل حذف حسابه"})
  }
  if(!["GET","HEAD","OPTIONS"].includes(req.method)){
   const auditId="audit_"+randomUUID(),keys=req.body&&typeof req.body==="object"?Object.keys(req.body as object).filter(key=>!/(password|secret|token|credential|authorization)/i.test(key)).slice(0,30):[]
   await getDbPool().query(`INSERT INTO publishing_audit(id,actor_id,actor_role,method,path,resource,detail) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)`,[auditId,id,access.role,req.method,path,path.split("/")[2]||"admin",JSON.stringify({fields:keys,operation:Object.fromEntries(["action","user_id","role","revision","restore_revision"].filter(key=>req.body&&Object.prototype.hasOwnProperty.call(req.body,key)).map(key=>[key,String((req.body as any)[key]).slice(0,150)]))})])
   ;(req as any).publishing_audit_id=auditId
   res.once("finish",()=>{void getDbPool().query("UPDATE publishing_audit SET http_status=$2,completed_at=now() WHERE id=$1",[auditId,res.statusCode]).catch(()=>console.error("[Publishing audit] Failed to finalize audit",auditId))})
  }
  return next()
 }catch(error:any){return res.status(error.status||503).json({message:error.status?error.message:"تعذر التحقق من صلاحيات الإدارة"})}
}
