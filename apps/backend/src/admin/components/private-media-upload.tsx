import React,{useEffect,useRef,useState} from "react"
import {adminFetch} from "../lib/admin-fetch"
async function json(path:string,body?:unknown){return (await adminFetch(path,body===undefined?undefined:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})).json()}
function sendPart(path:string,body:Blob,type:string,onProgress:(n:number)=>void,signal:AbortSignal){return new Promise<any>((resolve,reject)=>{
 const xhr=new XMLHttpRequest();xhr.open(path.includes("/parts/")?"PUT":"POST",path);xhr.withCredentials=true;xhr.setRequestHeader("Content-Type",type)
 xhr.upload.onprogress=event=>onProgress(event.loaded);xhr.onerror=()=>reject(Error("انقطع الاتصال؛ اختر الملف مجددًا لاستكمال الرفع"));xhr.onabort=()=>reject(Error("أُوقف الرفع مؤقتًا"));xhr.onload=()=>{let data:any={};try{data=JSON.parse(xhr.responseText)}catch{}xhr.status>=200&&xhr.status<300?resolve(data):reject(Error(data.message||`HTTP ${xhr.status}`))};signal.addEventListener("abort",()=>xhr.abort(),{once:true});xhr.send(body)
})}
const mime=(file:File)=>({pdf:"application/pdf",epub:"application/epub+zip",mp3:"audio/mpeg",m4a:"audio/mp4",m4b:"audio/mp4",wav:"audio/wav"}as Record<string,string>)[file.name.split(".").pop()?.toLowerCase()||""]||file.type
export function PrivateMediaUpload({storageKey,type,onUploaded,onBusy}:{storageKey:string;type:string;onUploaded:(data:any)=>void;onBusy:(busy:boolean)=>void}){
 const [progress,setProgress]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState(""),[url,setUrl]=useState("")
 const abort=useRef<AbortController|null>(null),session=useRef("")
 useEffect(()=>()=>{abort.current?.abort()},[])
 async function upload(file:File){setBusy(true);onBusy(true);setError("");setProgress(0);setUrl("");const controller=new AbortController();abort.current=controller
  try{
   if(file.size<=32*1024**2){const data=await sendPart("/admin/story-media/upload",file,mime(file),n=>setProgress(Math.round(n/file.size*100)),controller.signal);onUploaded(data);if(data.preview_url)setUrl(data.preview_url);setProgress(100);return}
   const fingerprint=[file.name,file.size,file.lastModified,mime(file)].join(":"),journal="storyverse.upload."+fingerprint
   let state:any;const previous=localStorage.getItem(journal)
   if(previous){try{state=await json("/admin/assets/uploads/"+previous)}catch{localStorage.removeItem(journal)}}
   if(!state||state.status==="aborted"){state=await json("/admin/assets/uploads",{filename:file.name,total_bytes:file.size,mime_type:mime(file)});localStorage.setItem(journal,state.id)}
   session.current=state.id
   if(state.status==="completed"){session.current="";localStorage.removeItem(journal);onUploaded({key:state.key,mime_type:state.mime_type});setUrl(state.preview_url);setProgress(100);return}
   let uploaded=0
   for(let offset=0,part=1;offset<file.size;offset+=state.part_size,part++){
    if(controller.signal.aborted)throw Error("أُوقف الرفع مؤقتًا")
    const chunk=file.slice(offset,offset+state.part_size),existing=state.parts.find((p:any)=>p.part_number===part)
    if(existing){const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",await chunk.arrayBuffer()))).map(n=>n.toString(16).padStart(2,"0")).join("");if(hash!==existing.checksum)throw Error("الملف مختلف عن عملية الرفع السابقة")}
    else{let done=false;for(let attempt=0;attempt<3&&!done;attempt++){try{await sendPart(`/admin/assets/uploads/${state.id}/parts/${part}`,chunk,"application/octet-stream",n=>setProgress(Math.round((uploaded+n)/file.size*100)),controller.signal);done=true}catch(error){if(controller.signal.aborted||attempt===2)throw error;await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)))}}}
    uploaded+=chunk.size;setProgress(Math.round(uploaded/file.size*100))
   }
   const result=await json(`/admin/assets/uploads/${state.id}/complete`,{});localStorage.removeItem(journal);session.current="";setUrl(result.preview_url);onUploaded(result)
  }catch(error:any){setError(error.message)}finally{setBusy(false);onBusy(false)}
 }
 async function preview(){try{setError("");const data=await json("/admin/assets/preview",{key:storageKey});setUrl(data.url)}catch(error:any){setError(error.message)}}
 return <div className="space-y-2"><label>رفع ملف · حتى 2 GB<input className="block" type="file" accept=".pdf,.epub,.mp3,.m4b,.m4a,.wav" disabled={busy} onChange={e=>{if(e.target.files?.[0])void upload(e.target.files[0]);e.target.value=""}}/></label>{(busy||progress>0)&&<><progress aria-label="تقدم رفع الملف" max={100} value={progress}/><span role="status"> {progress}% {busy?"جارٍ الرفع":""}</span></>}{busy&&<button type="button" onClick={()=>abort.current?.abort()}>إيقاف مؤقت</button>}{session.current&&!busy&&<button type="button" onClick={async()=>{try{await adminFetch("/admin/assets/uploads/"+session.current,{method:"DELETE"});session.current="";setError("أُلغي الرفع؛ اختر الملف لبدء عملية جديدة")}catch(e:any){setError(e.message)}}}>إلغاء الأجزاء المرفوعة</button>}{storageKey&&!busy&&<button type="button" className="underline" onClick={preview}>معاينة الملف · تجديد الرابط</button>}{url&&(type.includes("pdf")?<iframe title="معاينة PDF" src={url} className="w-full h-80"/>:type.startsWith("audio/")?<audio controls src={url}/>:<a href={url} target="_blank" rel="noreferrer">تنزيل معاينة EPUB</a>)}{error&&<p role="alert" className="text-red-700">{error}</p>}<p className="text-xs">الملفات الكبيرة تُرفع على أجزاء. للاستئناف اختر نفس الملف خلال 24 ساعة. روابط المعاينة صالحة لدقيقة.</p></div>
}
