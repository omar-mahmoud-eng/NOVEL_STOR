import nodemailer from "nodemailer"
export function mailConfigured(){return Boolean(process.env.SMTP_HOST)}
export async function sendMail(to:string,subject:string,text:string){
 if(!mailConfigured())throw Error("Mail delivery is not configured")
 const host=process.env.SMTP_HOST!
 if(process.env.MAIL_DELIVERY_MODE!=="external" && !["mailpit","localhost","127.0.0.1"].includes(host))throw Error("External delivery is disabled")
 const transport=nodemailer.createTransport({host,port:Number(process.env.SMTP_PORT||1025),secure:process.env.SMTP_SECURE==="true",auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined,connectionTimeout:10000,socketTimeout:15000})
 return transport.sendMail({from:process.env.SMTP_FROM||"StoryVerse <noreply@storyverse.local>",to,subject,text})
}
