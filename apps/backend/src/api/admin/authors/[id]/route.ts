import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{z}from"zod"
import{STORY_MODULE}from"../../../../modules/story"
import{getDbPool}from"../../../../utils/db"
const Input=z.object({name:z.string().min(2).max(120),bio:z.string().max(2000).optional(),avatar_url:z.union([z.literal(""),z.string().url()]).optional(),royalty_percentage:z.number().min(0).max(100)})
export async function POST(req:MedusaRequest,res:MedusaResponse){const input=Input.safeParse(req.body);if(!input.success)return res.status(400).json({message:"Invalid author",errors:input.error.issues});try{const service=req.scope.resolve(STORY_MODULE)as any;const author=await service.updateAuthors({id:req.params.id,...input.data,avatar_url:input.data.avatar_url||null});return res.json({author})}catch{return res.status(404).json({message:"Author not found"})}}
export async function DELETE(req:MedusaRequest,res:MedusaResponse){const used=await getDbPool().query(`SELECT id FROM story_metadata WHERE author_id=$1 AND deleted_at IS NULL LIMIT 1`,[req.params.id]);if(used.rowCount)return res.status(409).json({message:"المؤلف مرتبط بعمل. غيّر الارتباط أولًا."});try{await(req.scope.resolve(STORY_MODULE)as any).deleteAuthors(req.params.id);return res.json({deleted:true,id:req.params.id})}catch{return res.status(404).json({message:"Author not found"})}}
