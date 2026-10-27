import type { SubscriberArgs,SubscriberConfig } from "@medusajs/framework"
import { mailConfigured,sendMail } from "../utils/mail"
export default async function passwordReset({event:{data},container}:SubscriberArgs<{entity_id:string;actor_type:string;token:string;metadata?:Record<string,unknown>}>){
 if(data.actor_type!=="customer")return
 if(!mailConfigured()){container.resolve("logger").warn("Password reset delivery is not configured.");return}
 const locale=data.metadata?.locale==="en"?"en":"ar"
 const url=new URL(`/${locale}/reset-password`,process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000")
 url.searchParams.set("token",data.token)
 await sendMail(data.entity_id,"StoryVerse · إعادة تعيين كلمة المرور",`طُلبت إعادة تعيين كلمة مرور حسابك. افتح الرابط التالي خلال ساعة:\n\n${url}\n\nإذا لم تطلب ذلك، تجاهل هذه الرسالة. لا تشارك هذا الرابط.`)
}
export const config:SubscriberConfig={event:"auth.password_reset"}
