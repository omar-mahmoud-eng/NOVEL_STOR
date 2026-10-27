import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{z}from"zod"
import{transitionBook}from"../../../../../utils/publishing-books"
import{accessOf}from"../../../../../utils/publishing-access"
import{apiError}from"../../../../../utils/api-error"
export async function POST(req:MedusaRequest,res:MedusaResponse){try{
 const body=z.object({books:z.array(z.object({id:z.string(),revision:z.number().int().positive()})).min(1).max(30),action:z.enum(["submit","approve","publish","archive","reopen"]),note:z.string().max(2000).default("")}).parse(req.body)
 const results=[];for(const item of body.books){try{const row=await transitionBook(item.id,item.revision,body.action,accessOf(req)!,body.note);results.push({id:item.id,success:true,revision:row.revision})}catch(error:any){results.push({id:item.id,success:false,status:error.status||500,message:error.status?error.message:"تعذر التنفيذ"})}}
 return res.json({results})
 }catch(error){return apiError(res,error)}}
