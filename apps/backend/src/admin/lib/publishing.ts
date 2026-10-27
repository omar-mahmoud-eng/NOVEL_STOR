import {useEffect,useState} from "react"
import {adminFetch} from "./admin-fetch"
export async function publishingJson(path:string,body?:unknown,method="POST"){const response=await adminFetch(path,body===undefined?undefined:{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});return response.json()}
export function usePublishingAccess(){const [access,setAccess]=useState<any>(null),[error,setError]=useState("");useEffect(()=>{publishingJson("/admin/publishing/access").then(data=>setAccess(data.access)).catch(error=>setError(error.message))},[]);return{access,error,can:(permission:string)=>Boolean(access?.permissions?.includes("*")||access?.permissions?.includes(permission))}}
export const workflowLabels:Record<string,string>={draft:"مسودة",review:"بانتظار المراجعة",approved:"معتمد",published:"منشور",archived:"مؤرشف"}
