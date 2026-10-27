"use client"
import {useEffect,useState} from "react"
import Link from "next/link"
import {useCustomerAuth} from "@/context/customer-auth-context"
import {useFamilySetting} from "@/hooks/use-family-setting"
import {useReadingState} from "@/context/reading-state-context"
import {realmBase,type ReadingRealm} from "@/lib/realms"
export function RecommendationShelf({realm,locale}:{realm:ReadingRealm;locale:string}){
 const {customer}=useCustomerAuth(),{lastSyncedAt}=useReadingState(),[profile]=useFamilySetting<{id:string;realm:string}|null>("storyverse.family.activeProfile",null),[books,setBooks]=useState<any[]>([])
 const profileId=customer&&profile?.realm===realm?profile.id:"",base=realmBase(locale as "ar"|"en",realm)
 useEffect(()=>{const controller=new AbortController();fetch("/api/medusa/store/recommendations?"+new URLSearchParams({realm,...profileId?{profile_id:profileId}:{}}),{cache:"no-store",signal:controller.signal}).then(async response=>{if(!response.ok)return;const data=await response.json();setBooks(data.recommendations||[])}).catch(()=>{});return()=>controller.abort()},[realm,customer?.id,profileId,lastSyncedAt])
 if(!books.length)return null
 return <section className="space-y-4 border rounded-2xl p-5" aria-label="توصيات القراءة"><h2 className="text-2xl font-bold">{locale==="ar"?"حكايات مقترحة لك":"Suggested stories"}</h2><div className="grid sm:grid-cols-3 gap-4">{books.map(book=><article key={book.id}><Link className="font-bold underline" href={`${base}/books/${book.handle}`}>{book.title}</Link><p className="text-sm">{locale==="ar"?book.recommendation_reason:"Published in your chosen reading realm"}</p></article>)}</div></section>
}
