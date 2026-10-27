import { randomUUID } from "node:crypto"
import { z } from "zod"
import { getDbPool } from "./db"
import { starterCatalog } from "../data/reading-catalog"
import {operationalSchema} from "../data/operational-schema"
import {crmSchema} from "../data/crm-schema"
import {publishingSchema,backfillPublishedSnapshots} from "../data/publishing-schema"

export const ReadingStoryInput = z.object({
  handle: z.string().trim().min(2).max(150).regex(/^[a-zA-Z0-9_-]+$/),
  title: z.string().trim().min(2).max(200),
  realm: z.enum(["originals", "little", "kids", "teens"]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  description: z.string().trim().min(1).max(12000),
  coverUrl: z.string().url().max(3000),
  author: z.object({ name: z.string().trim().min(1).max(150), bio: z.string().max(5000).default(""), avatar: z.union([z.literal(""), z.string().url()]).default("") }),
  genre: z.enum(["mystery", "historical", "scifi", "classics", "adventure", "drama"]).default("classics"),
  minutes: z.number().int().min(1).max(2000).default(10),
  sampleText: z.array(z.string().trim().min(1).max(100000)).min(1).max(200),
  sectionImages: z.array(z.union([z.string().url(), z.literal("")])).max(200).optional(),
  product_id: z.string().max(150).nullable().optional(),
})
const ages = { originals: "adults_18_plus", little: "kids_3_6", kids: "kids_7_12", teens: "teens_13_17" }
export function readingBook(row: any) {
  return { ...row.data, id: row.id, handle: row.handle, title: row.title, realm:row.realm, ageGroup: ages[row.realm as keyof typeof ages],
    paperbackPrice: 0, ebookPrice: 0, audiobookPrice: 0, paperbackVariantId: "", ebookVariantId: "", audiobookVariantId: "", defaultVariantId: "", hasAudioSample: false, sampleAudioUrl: "", audioChapters: [], product_id: row.product_id || null,
    revision: row.revision, status: row.status, workflow_state:row.workflow_state||row.status,published_revision:row.published_revision||null,published_handle:row.published_snapshot?.handle||null,published_realm:row.published_snapshot?.realm||null }
}
export async function initializeReadingContent() {
  const pool = getDbPool()
  await pool.query(operationalSchema)
  await pool.query(crmSchema)
  await pool.query(`ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS customer_id text`)
  await pool.query(`CREATE TABLE IF NOT EXISTS reading_stories (
    id text PRIMARY KEY, handle text NOT NULL UNIQUE, title text NOT NULL,
    realm text NOT NULL CHECK (realm IN ('originals','little','kids','teens')),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
    data jsonb NOT NULL, product_id text, revision integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
  )`)
  await pool.query(`CREATE INDEX IF NOT EXISTS reading_stories_published_realm ON reading_stories (realm, status) WHERE deleted_at IS NULL`)
  await pool.query(publishingSchema)
  await pool.query(backfillPublishedSnapshots)
  if (process.env.SEED_READING_CATALOG === "false") return
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    for (const item of starterCatalog) {
      const realm = Object.keys(ages).find(key => ages[key as keyof typeof ages] === item.ageGroup) || "originals"
      await client.query(`INSERT INTO reading_stories (id,handle,title,realm,status,data) VALUES ($1,$2,$3,$4,'published',$5) ON CONFLICT DO NOTHING`, [item.id,item.handle,item.title,realm,JSON.stringify(item)])
      if(item.genre!=="classics")await client.query(`UPDATE reading_stories SET data=jsonb_set(data,'{genre}',to_jsonb($2::text)),revision=revision+1,updated_at=now() WHERE id=$1 AND revision=1 AND status='published' AND deleted_at IS NULL AND data->>'starterContent'='true' AND data->>'genre'='classics' AND data->'sampleText'=$3::jsonb`,[item.id,item.genre,JSON.stringify(item.sampleText)])
    }
    await client.query("COMMIT")
    await pool.query(backfillPublishedSnapshots)
  } catch (error) { await client.query("ROLLBACK"); throw error }
  finally { client.release() }
}
export function storySnapshot(row:any){return {id:row.id,handle:row.handle,title:row.title,realm:row.realm,status:row.status,data:row.data,product_id:row.product_id,revision:row.revision,workflow_state:row.workflow_state,review_note:row.review_note,reviewed_by:row.reviewed_by,published_revision:row.published_revision}}
export async function recordStoryVersion(client:any,row:any,action:string,actorId?:string,note=""){
  await client.query(`INSERT INTO reading_story_versions(id,story_id,revision,snapshot,action,actor_id,note) VALUES($1,$2,$3,$4::jsonb,$5,$6,$7) ON CONFLICT(story_id,revision) DO NOTHING`,["version_"+randomUUID(),row.id,row.revision,JSON.stringify(storySnapshot(row)),action,actorId||null,note])
}
export function publicReadingBook(row:any){return readingBook(row.published_snapshot||row)}
export async function writeReadingStory(input: z.infer<typeof ReadingStoryInput>, id?: string, revision?: number,options:{actorId?:string;preservePublished?:boolean;note?:string}={}) {
  const pool = getDbPool(),client=await pool.connect()
  try{await client.query("BEGIN")
  const conflict=await client.query(`SELECT id FROM reading_stories WHERE id<>$1 AND deleted_at IS NULL AND (handle=$2 OR (status='published' AND published_snapshot->>'handle'=$2))`,[id||"",input.handle])
  if(conflict.rowCount)throw Object.assign(new Error("رابط الكتاب مستخدم بالفعل"),{status:409})
  if (input.product_id) {
    const product = await client.query(`SELECT id FROM product WHERE id=$1 AND deleted_at IS NULL`,[input.product_id])
    if (!product.rowCount) throw Object.assign(new Error("Linked product does not exist"),{status:400})
  }
  let row:any
  if (id) {
    const before=(await client.query(`SELECT * FROM reading_stories WHERE id=$1 AND deleted_at IS NULL FOR UPDATE`,[id])).rows[0]
    if(!before)throw Object.assign(new Error("Story not found"),{status:404})
    if(before.revision!==revision)throw Object.assign(new Error("Story changed in another session. Reload before saving."),{status:409})
    if(options.preservePublished&&["review","approved"].includes(before.workflow_state))throw Object.assign(new Error("اسحب الكتاب إلى المسودة قبل تعديله حتى لا تتغير النسخة قيد المراجعة"),{status:409})
    await recordStoryVersion(client,before,"baseline",options.actorId)
    const status=options.preservePublished?(before.status==="published"?"published":"draft"):input.status
    row=(await client.query(`UPDATE reading_stories SET handle=$2,title=$3,realm=$4,status=$5,data=$6,product_id=$7,revision=revision+1,workflow_state=$8,review_note=NULL,reviewed_by=NULL,approved_at=NULL,updated_at=now() WHERE id=$1 RETURNING *`,[id,input.handle,input.title,input.realm,status,JSON.stringify(input),input.product_id||null,options.preservePublished?"draft":input.status])).rows[0]
  }else{
    row=(await client.query(`INSERT INTO reading_stories (id,handle,title,realm,status,data,product_id,workflow_state) VALUES ($1,$2,$3,$4,$5,$6,$7,$5) RETURNING *`,[`reading_${randomUUID()}`,input.handle,input.title,input.realm,options.preservePublished?"draft":input.status,JSON.stringify(input),input.product_id||null])).rows[0]
  }
  if(!options.preservePublished){
    const snapshot=input.status==="published"?{...storySnapshot(row),status:"published",workflow_state:"published"}:null
    row=(await client.query(`UPDATE reading_stories SET published_snapshot=$2::jsonb,published_revision=$3,published_at=CASE WHEN $2::jsonb IS NOT NULL THEN now() ELSE published_at END WHERE id=$1 RETURNING *`,[row.id,snapshot?JSON.stringify(snapshot):null,snapshot?row.revision:null])).rows[0]
  }
  await recordStoryVersion(client,row,options.preservePublished?"save_draft":input.status==="published"?"direct_publish":"save",options.actorId,options.note||"")
  await client.query("COMMIT");return row
  }catch(error){await client.query("ROLLBACK");throw error}finally{client.release()}
}
