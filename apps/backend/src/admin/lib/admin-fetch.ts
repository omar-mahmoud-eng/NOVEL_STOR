import "./client-monitor"
export async function adminFetch(input:RequestInfo|URL,init?:RequestInit){
 try{const response=await fetch(input,{credentials:"include",...init});if(!response.ok){let message=`HTTP ${response.status}`;try{const data=await response.clone().json();message=data.message||data.errors?.map((issue:any)=>issue.message).join(" · ")||message}catch{}if(response.status===401)message="انتهت جلسة الإدارة. سجّل الدخول مجددًا.";throw Error(message)}window.dispatchEvent(new CustomEvent("storyverse.admin.success"));return response}
 catch(error:any){window.dispatchEvent(new CustomEvent("storyverse.admin.error",{detail:{message:error.message||"تعذر الاتصال بالخادم"}}));throw error}
}
