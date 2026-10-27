import { NextResponse } from "next/server"
import { z } from "zod"
import { backendFetch,sameOrigin } from "@/lib/medusa-server"
const RequestInput=z.object({email:z.string().trim().email().max(255),locale:z.enum(["ar","en"]).default("ar")})
const ResetInput=z.object({token:z.string().min(20).max(4096),password:z.string().min(8).max(256)})
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}})
export async function POST(request:Request){
 if(!sameOrigin(request))return json({message:"Invalid origin"},403)
 try{const body=await request.json();if(body.action==="reset"){const input=ResetInput.safeParse(body);if(!input.success)return json({message:"Invalid reset data"},400);const result=await backendFetch("/auth/customer/emailpass/update",{method:"POST",body:JSON.stringify({password:input.data.password})},input.data.token);if(!result.ok)return json({message:"انتهت صلاحية الرابط أو تم استخدامه. اطلب رابطًا جديدًا."},result.status===401?400:result.status);return json({success:true})}
 const input=RequestInput.safeParse(body);if(!input.success)return json({message:"اكتب بريدًا إلكترونيًا صحيحًا."},400)
 const capabilities=await backendFetch("/store/platform-config");if(!capabilities.ok||!(await capabilities.json()).password_reset)return json({message:"مزود رسائل الاستعادة غير مجهز لهذه البيئة."},503)
 const result=await backendFetch("/auth/customer/emailpass/reset-password",{method:"POST",body:JSON.stringify({identifier:input.data.email,metadata:{locale:input.data.locale}})})
 if(!result.ok)return json({message:result.status===429?"محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.":"تعذر طلب رابط الاستعادة."},result.status)
 return json({success:true,message:"إذا كان الحساب موجودًا فسيصل رابط الاستعادة إلى البريد المجهز لهذه البيئة."})
 }catch{return json({message:"خدمة الاستعادة غير متاحة مؤقتًا."},502)}
}
