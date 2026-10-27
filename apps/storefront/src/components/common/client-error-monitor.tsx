"use client"
import {useEffect} from "react"
export function ClientErrorMonitor(){useEffect(()=>{
 let count=0,start=Date.now();const seen=new Set<string>()
 const send=(message:string)=>{if(Date.now()-start>60000){count=0;start=Date.now();seen.clear()}if(count>=5||seen.has(message)||!message||/AbortError/.test(message))return;seen.add(message);count++;void fetch("/api/medusa/store/client-events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:message.slice(0,1200),path:window.location.pathname}),keepalive:true}).catch(()=>{})}
 const error=(e:ErrorEvent)=>send(e.message),rejection=(e:PromiseRejectionEvent)=>send(e.reason?.message||String(e.reason));window.addEventListener("error",error);window.addEventListener("unhandledrejection",rejection);return()=>{window.removeEventListener("error",error);window.removeEventListener("unhandledrejection",rejection)}
 },[]);return null}
