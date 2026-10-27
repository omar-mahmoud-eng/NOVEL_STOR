import { z } from "zod"
import { getDbPool } from "./db"
import { ReadingStoryInput, recordStoryVersion, storySnapshot, writeReadingStory } from "./reading-content"
import { can, type PublishingAccess } from "./publishing-access"

export const DraftBookInput=ReadingStoryInput.extend({
 status:z.literal("draft").default("draft"),description:z.string().max(12000).default(""),
 coverUrl:z.union([z.literal(""),z.string().url().max(3000)]).default(""),
 sampleText:z.array(z.string().max(100000)).max(200).default([""]),
 author:z.object({name:z.string().trim().min(1).max(150),bio:z.string().max(5000).default(""),avatar:z.union([z.literal(""),z.string().url()]).default("")}).default({name:"هيئة التحرير",bio:"",avatar:""}),
})
export async function saveDraftBook(input:unknown,id:string|undefined,revision:number|undefined,actor:PublishingAccess){
 if(!can(actor,"content.edit"))throw Object.assign(new Error("لا توجد صلاحية تحرير المحتوى"),{status:403})
 const value=DraftBookInput.parse(input)
 return writeReadingStory(value as z.infer<typeof ReadingStoryInput>,id,revision,{actorId:actor.user_id,preservePublished:true})
}
export function validateTransition(state:string,action:string,actor:PublishingAccess,note=""){
 const rules:Record<string,{from:string[];permission:string;next:string}>={
  submit:{from:["draft"],permission:"content.edit",next:"review"},
  approve:{from:["review"],permission:"content.review",next:"approved"},
  reject:{from:["review","approved"],permission:"content.review",next:"draft"},
  reopen:{from:["review","approved","published","archived"],permission:"content.edit",next:"draft"},
  publish:{from:["approved"],permission:"content.publish",next:"published"},
  archive:{from:["draft","review","approved","published"],permission:"content.publish",next:"archived"},
 }
 const rule=rules[action];if(!rule)throw Object.assign(new Error("إجراء غير معروف"),{status:400})
 if(!can(actor,rule.permission))throw Object.assign(new Error("ليست لديك صلاحية الاعتماد أو النشر"),{status:403})
 if(!rule.from.includes(state))throw Object.assign(new Error("حالة الكتاب تغيرت؛ أعد تحميله قبل متابعة الإجراء"),{status:409})
 if(action==="reject"&&note.trim().length<2)throw Object.assign(new Error("اكتب سبب إعادة المسودة"),{status:400})
 return rule.next
}
export async function transitionBook(id:string,revision:number,action:string,actor:PublishingAccess,note="",restoreRevision?:number){
 const client=await getDbPool().connect()
 try{
  await client.query("BEGIN")
  const row=(await client.query("SELECT * FROM reading_stories WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",[id])).rows[0]
  if(!row)throw Object.assign(new Error("الكتاب غير موجود"),{status:404})
  if(row.revision!==revision)throw Object.assign(new Error("هناك تعديل أحدث؛ أعد التحميل"),{status:409})
  await recordStoryVersion(client,row,"baseline",actor.user_id)
  let next:string
  if(action==="restore"){
   if(!can(actor,"content.edit"))throw Object.assign(new Error("لا توجد صلاحية استعادة المحتوى"),{status:403})
   if(note.trim().length<2)throw Object.assign(new Error("اكتب سبب الاستعادة"),{status:400})
   const old=(await client.query("SELECT snapshot FROM reading_story_versions WHERE story_id=$1 AND revision=$2",[id,restoreRevision])).rows[0]?.snapshot
   if(!old)throw Object.assign(new Error("النسخة غير موجودة"),{status:404})
   row.data=old.data;row.title=old.title;row.handle=old.handle;row.realm=old.realm;row.product_id=old.product_id;next="draft"
  }else next=validateTransition(row.workflow_state||row.status,action,actor,note)
  if(action==="submit"||action==="publish"){
   const validated=ReadingStoryInput.safeParse({...row.data,title:row.title,handle:row.handle,realm:row.realm,status:"published"})
   if(!validated.success)throw Object.assign(new Error("أكمل الغلاف والوصف ومقاطع القراءة قبل المراجعة أو النشر"),{status:422,issues:validated.error.issues})
   if(row.product_id){const product=await client.query("SELECT status,metadata FROM product WHERE id=$1 AND deleted_at IS NULL",[row.product_id]);if(!product.rowCount||product.rows[0].status!=="published")throw Object.assign(new Error("المنتج المرتبط يجب أن يكون موجودًا ومنشورًا"),{status:422});const ages:Record<string,string>={originals:"adults_18_plus",little:"kids_3_6",kids:"kids_7_12",teens:"teens_13_17"};if(product.rows[0].metadata?.age_group&&product.rows[0].metadata.age_group!==ages[row.realm])throw Object.assign(new Error("فئة المنتج المرتبط تختلف عن منصة الكتاب؛ صححها من تبويب الملفات قبل المراجعة"),{status:422})}
  }
  const collision=await client.query(`SELECT id FROM reading_stories WHERE id<>$1 AND deleted_at IS NULL AND (handle=$2 OR (status='published' AND published_snapshot->>'handle'=$2))`,[id,row.handle])
  if(collision.rowCount)throw Object.assign(new Error("رابط الكتاب مستخدم في إصدار آخر"),{status:409})
  row.revision++;row.workflow_state=next
  if(action==="publish"){row.status="published";row.published_revision=row.revision;row.published_snapshot={...storySnapshot(row),status:"published",workflow_state:"published"}}
  if(action==="archive")row.status="archived"
  // Reopening/restoring an archived book never makes the old edition public.
  if(next==="draft"&&row.status==="archived")row.status="draft"
  const saved=(await client.query(`UPDATE reading_stories SET handle=$2,title=$3,realm=$4,data=$5::jsonb,product_id=$6,status=$7,workflow_state=$8,revision=$9,published_snapshot=$10::jsonb,published_revision=$11,
    review_note=$12,reviewed_by=CASE WHEN $13::boolean THEN $14 ELSE NULL END,
    submitted_at=CASE WHEN $8='review' THEN now() ELSE submitted_at END,approved_at=CASE WHEN $8='approved' THEN now() ELSE NULL END,
    published_at=CASE WHEN $8='published' THEN now() ELSE published_at END,updated_at=now() WHERE id=$1 RETURNING *`,[id,row.handle,row.title,row.realm,JSON.stringify(row.data),row.product_id,row.status,next,row.revision,JSON.stringify(row.published_snapshot),row.published_revision,note,["approve","reject","publish"].includes(action),actor.user_id])).rows[0]
  await recordStoryVersion(client,saved,action,actor.user_id,note)
  await client.query("COMMIT");return saved
 }catch(error){await client.query("ROLLBACK");throw error}finally{client.release()}
}
