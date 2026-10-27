"use client"
import { createContext,useContext,useEffect,useState } from "react"
import { usePathname } from "next/navigation"
import { PUBLISHING_BOOKS,type StoryBookData } from "@/lib/books-data"
type Catalog={books:StoryBookData[];loading:boolean;error:string;refresh:()=>void}
const Context=createContext<Catalog>({books:PUBLISHING_BOOKS,loading:true,error:"",refresh:()=>{}})
export function CatalogProvider({children}:{children:React.ReactNode}){
 const [books,setBooks]=useState(PUBLISHING_BOOKS),[loading,setLoading]=useState(true),[error,setError]=useState(""),[version,setVersion]=useState(0),path=usePathname()
 useEffect(()=>{const controller=new AbortController();setLoading(true);fetch("/api/medusa/store/reading-stories",{cache:"no-store",signal:controller.signal}).then(async response=>{if(!response.ok)throw Error("تعذر تحديث فهرس القراءة من الخادم.");const data=await response.json();if(!Array.isArray(data.books))throw Error("تعذر قراءة الفهرس");setBooks(data.books);setError("");try{localStorage.setItem("storyverse.catalog.v1",JSON.stringify(data.books))}catch{}}).catch(error=>{if(error.name==="AbortError")return;try{const cached=JSON.parse(localStorage.getItem("storyverse.catalog.v1")||"null");if(Array.isArray(cached))setBooks(cached)}catch{}setError("الفهرس غير متصل بالخادم. تُعرض آخر نسخة متاحة على هذا الجهاز.")}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return()=>controller.abort()},[path,version])
 return <Context.Provider value={{books,loading,error,refresh:()=>setVersion(value=>value+1)}}>{children}</Context.Provider>
}
export function useCatalog(){return useContext(Context)}
export function useCatalogBooks(){return useCatalog().books}
