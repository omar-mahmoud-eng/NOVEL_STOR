"use client"
import { useEffect, useState } from "react"
import {useCustomerAuth} from "@/context/customer-auth-context"
import {usePathname} from "next/navigation"
import {realmFromPath} from "@/lib/realms"
import Link from "next/link"
import { useFamilySetting as useLocalSetting } from "@/hooks/use-family-setting"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
export function ReadingBreak({locale}:{locale:"ar"|"en"}) {
 const [limit]=useLocalSetting("storyverse.family.timeLimit",45),[quiet]=useLocalSetting("storyverse.family.quiet",true)
 const [open,setOpen]=useState(false),[night,setNight]=useState(false)
 const {customer}=useCustomerAuth(),realm=realmFromPath(usePathname()||"")
 const [profile]=useLocalSetting<{id:string;realm:string}|null>("storyverse.family.activeProfile",null)
 const scope=`${customer?.id||"guest"}.${profile?.realm===realm?profile.id:"shared"}`
 const dayKey=()=>`storyverse.reading-time.${scope}.${new Date().toLocaleDateString("en-CA")}`
 useEffect(()=>{
  let previous=performance.now(),visible=document.visibilityState==="visible"
  const tick=(notify=true)=>{const now=performance.now(),elapsed=visible?Math.max(0,(now-previous)/1000):0;previous=now;visible=document.visibilityState==="visible";const key=dayKey();try{const seconds=Math.max(0,Number(localStorage.getItem(key))||0)+elapsed;localStorage.setItem(key,String(seconds));if(notify){setOpen(seconds>=limit*60&&!sessionStorage.getItem(key+".dismissed"));setNight(quiet&&new Date().getHours()>=20)}}catch{}}
  tick();const timer=setInterval(tick,15000),change=()=>tick();document.addEventListener("visibilitychange",change);return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",change);tick(false)}
 },[limit,quiet,scope])
 function dismiss(){try{sessionStorage.setItem(dayKey()+".dismissed","true")}catch{}setOpen(false)}
 return <>{night&&<aside className="text-center text-sm px-4 py-2 bg-[#e7eee9] text-[#354d40]" role="status">{locale==="ar"?"وقت هادئ للقراءة قبل النوم. خذ استراحة عندما تحتاج.":"Quiet reading time. Take a break when you need one."}</aside>}<Dialog open={open} onOpenChange={value=>{if(!value)dismiss()}}><DialogContent dir={locale==="ar"?"rtl":"ltr"}><DialogHeader><DialogTitle>{locale==="ar"?"حان وقت استراحة هادئة":"Time for a quiet break"}</DialogTitle></DialogHeader><p>{locale==="ar"?`مرّ ${limit} دقيقة من استخدام منصات الصغار على هذا الجهاز اليوم.`:`You have spent ${limit} minutes in the reading realms on this device today.`}</p><Link className="family-button" href={`/${locale}/platforms`}>{locale==="ar"?"نخرج ونستريح":"Leave and rest"}</Link><button className="family-button" onClick={dismiss}>{locale==="ar"?"متابعة القراءة الآن":"Continue reading for now"}</button></DialogContent></Dialog></>
}
