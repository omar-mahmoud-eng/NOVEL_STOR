import type { MedusaResponse } from "@medusajs/framework/http"
export function apiError(res:MedusaResponse,error:any){
 const status=error.status||error.statusCode||(error.code==="23505"?409:error.name==="ZodError"?400:500)
 if(status>=500)console.error("[Publishing API]",error.message)
 return res.status(status).json({message:status>=500?"تعذر إتمام العملية؛ حاول مجددًا":error.code==="23505"?"هذه القيمة مستخدمة بالفعل":error.message,errors:error.issues})
}
