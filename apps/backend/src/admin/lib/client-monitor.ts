let installed=false
export function installAdminMonitor(){
 if(installed||typeof window==="undefined")return;installed=true;let count=0,start=Date.now();const seen=new Set<string>()
 const send=(message:string)=>{if(Date.now()-start>60000){count=0;start=Date.now();seen.clear()}if(count>=5||seen.has(message)||!message||/AbortError/.test(message))return;seen.add(message);count++;void fetch("/admin/publishing/client-events",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:message.slice(0,1200),path:location.pathname})}).catch(()=>{})}
 window.addEventListener("error",e=>send(e.message));window.addEventListener("unhandledrejection",e=>send(e.reason?.message||String(e.reason)))
 const original=console.error;console.error=(...args:unknown[])=>{original(...args);const message=args.filter(arg=>typeof arg==="string"||arg instanceof Error).map(arg=>arg instanceof Error?arg.message:String(arg)).join(" ");if(/error|exception|failed/i.test(message))send(message)}
}
installAdminMonitor()
