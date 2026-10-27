import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{z}from"zod"
import{randomUUID}from"node:crypto"
import{mergeReadingStates,sanitizeReadingState,stampInitialReadingState,stripDeviceReadingState,READING_REALMS}from"@enterprise/schemas"
import{getDbPool}from"../../../utils/db"
import{apiError}from"../../../utils/api-error"
import{lockActiveReader,requireFamilyStepup}from"../../../utils/reader-profiles"
const Scope=z.object({profile_id:z.string().max(100).default(""),customer_id:z.string().max(100)})
async function owner(req:MedusaRequest,profileId:string,expected:string){const id=(req as any).auth_context?.actor_id;if(!id||id!==expected)throw Object.assign(new Error("جلسة الحساب تغيرت؛ أعد المحاولة"),{status:409});if(!profileId)return {id,realm:null};const row=(await getDbPool().query("SELECT realm FROM reader_profiles WHERE id=$1 AND customer_id=$2 AND deleted_at IS NULL",[profileId,id])).rows[0];if(!row)throw Object.assign(new Error("ملف القراءة غير موجود في هذا الحساب"),{status:404});return{id,realm:row.realm}}
export async function GET(req:MedusaRequest,res:MedusaResponse){try{const scope=Scope.parse(req.query),user=await owner(req,scope.profile_id,scope.customer_id),row=(await getDbPool().query("SELECT data,revision,analytics_opt_in FROM reader_states WHERE customer_id=$1 AND profile_id=$2",[user.id,scope.profile_id])).rows[0];res.setHeader("Cache-Control","private, no-store");return res.json({state:row?.data||{},revision:row?.revision||0,analytics_opt_in:row?.analytics_opt_in||false,server_time:new Date().toISOString(),profile_realm:user.realm})}catch(error){return apiError(res,error)}}
export async function POST(req:MedusaRequest,res:MedusaResponse){const client=await getDbPool().connect();try{
 const body=Scope.extend({state:z.record(z.string(),z.unknown()).optional(),analytics_opt_in:z.boolean().optional()}).parse(req.body),user=await owner(req,body.profile_id,body.customer_id)
 if(body.profile_id&&body.analytics_opt_in!==undefined)await requireFamilyStepup(req)
 await client.query("BEGIN");await lockActiveReader(client,user.id)
 if(body.profile_id){const profile=await client.query("SELECT id FROM reader_profiles WHERE id=$1 AND customer_id=$2 AND deleted_at IS NULL FOR SHARE",[body.profile_id,user.id]);if(!profile.rowCount)throw Object.assign(new Error("ملف القراءة غير موجود"),{status:404})}
 await client.query("INSERT INTO reader_states(customer_id,profile_id) VALUES($1,$2) ON CONFLICT DO NOTHING",[user.id,body.profile_id]);const current=(await client.query("SELECT * FROM reader_states WHERE customer_id=$1 AND profile_id=$2 FOR UPDATE",[user.id,body.profile_id])).rows[0]
 let incoming=body.state?stripDeviceReadingState(body.state):current.data
 if(user.realm&&body.state){for(const realm of READING_REALMS)if(realm!==user.realm&&Object.keys(sanitizeReadingState(incoming)[realm].entries).length)throw Object.assign(new Error("ملف الطفل مخصص لمنصة القراءة المحددة"),{status:403})}
 if(current.revision===0&&body.state)incoming=stampInitialReadingState(incoming,new Date().toISOString()+"|import")
 const merged=body.state?mergeReadingStates(current.data,incoming):sanitizeReadingState(current.data),consent=body.analytics_opt_in??current.analytics_opt_in
 const changed=JSON.stringify(merged)!==JSON.stringify(sanitizeReadingState(current.data))||consent!==current.analytics_opt_in
 for(const realm of READING_REALMS){const reset=merged[realm]._historyResetAt,previous=sanitizeReadingState(current.data)[realm]._historyResetAt;if(reset&&reset!==previous)await client.query("DELETE FROM reading_events WHERE customer_id=$1 AND profile_id=$2 AND realm=$3 AND created_at<=$4",[user.id,body.profile_id,realm,new Date(Math.min(Date.parse(reset.split("|")[0]),Date.now()))])}
 if(!consent)await client.query("DELETE FROM reading_events WHERE customer_id=$1 AND profile_id=$2",[user.id,body.profile_id])
 if(changed){
  if(consent&&current.revision>0&&body.state){
   const before=sanitizeReadingState(current.data),ids=READING_REALMS.flatMap(realm=>Object.keys(merged[realm].entries)),published=ids.length?(await client.query("SELECT id,COALESCE(published_snapshot->>'realm',realm) AS realm FROM reading_stories WHERE id=ANY($1::text[]) AND status='published' AND deleted_at IS NULL",[ids])).rows:[],realms=new Map(published.map(row=>[row.id,row.realm]))
   for(const realm of READING_REALMS)for(const[id,entry]of Object.entries(merged[realm].entries)){
    if(realms.get(id)!==realm)continue;const old=before[realm].entries[id]||{},events:{kind:string;field:string}[]=[]
    if(entry.page!==undefined&&entry.page!==old.page)events.push({kind:"progress",field:"page"})
    if(entry.completed&&!old.completed)events.push({kind:"completed",field:"completed"})
    if(entry.saved!==old.saved&&typeof entry.saved==="boolean")events.push({kind:entry.saved?"saved":"unsaved",field:"saved"})
    for(const event of events){const date=Date.parse((entry._fieldClocks?.[event.field]||entry.updatedAt||"").split("|")[0]);if(!Number.isFinite(date)||date<Date.now()-90*86400000)continue;await client.query("INSERT INTO reading_events(id,customer_id,profile_id,story_id,realm,kind,page,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",["read_"+randomUUID(),user.id,body.profile_id,id,realm,event.kind,entry.page??null,new Date(Math.min(date,Date.now()))])}
   }
  }
  await client.query("UPDATE reader_states SET data=$3::jsonb,revision=revision+1,analytics_opt_in=$4,updated_at=now() WHERE customer_id=$1 AND profile_id=$2",[user.id,body.profile_id,JSON.stringify(merged),consent])
 }
 await client.query("COMMIT");res.setHeader("Cache-Control","private, no-store");return res.json({state:merged,revision:current.revision+(changed?1:0),analytics_opt_in:consent,server_time:new Date().toISOString()})
 }catch(error){await client.query("ROLLBACK");return apiError(res,error)}finally{client.release()}}
