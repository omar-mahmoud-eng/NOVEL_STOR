"use client"
import{createContext,useContext,useEffect,useRef,useState}from"react"
import{usePathname}from"next/navigation"
import{useCustomerAuth}from"./customer-auth-context"
import{useFamilySetting}from"@/hooks/use-family-setting"
import{realmFromPath,type ReadingRealm}from"@/lib/realms"
import{freshReadingState,sanitizeReadingState,readingScopeKey,type ReadingEntry,type RealmReadingState,type ReadingState}from"@/lib/reading-state"
export type{ReadingEntry,RealmReadingState}from"@/lib/reading-state"
type Profile={id:string;name:string;realm:"little"|"kids"|"teens"}
type Value={state:ReadingState;ready:boolean;scopeKey:string;updateEntry:(realm:ReadingRealm,id:string,value:Partial<ReadingEntry>)=>void;updateSettings:(realm:ReadingRealm,value:Partial<Omit<RealmReadingState,"entries">>)=>void;clearHistory:(realm:ReadingRealm)=>void}
const Context=createContext<Value|null>(null)
export function ReadingStateProvider({children}:{children:React.ReactNode}){
 const {customer,isLoading}=useCustomerAuth(),path=usePathname()||"",realm=realmFromPath(path)
 const [profile]=useFamilySetting<Profile|null>("storyverse.family.activeProfile",null)
 const profileId=profile?.realm===realm&&typeof profile?.id==="string"?profile.id:undefined,key=readingScopeKey(customer?.id,profileId)
 const [state,setState]=useState<ReadingState>(freshReadingState),[loadedKey,setLoadedKey]=useState("")
 const currentKey=useRef(key);currentKey.current=key
 useEffect(()=>{if(isLoading)return;const read=()=>{let stored;try{stored=JSON.parse(localStorage.getItem(key)||"null")}catch{}setState(sanitizeReadingState(stored));setLoadedKey(key)};read();const change=(event:StorageEvent)=>{if(event.key===key)read()};window.addEventListener("storage",change);return()=>window.removeEventListener("storage",change)},[key,isLoading])
 const ready=loadedKey===key&&!isLoading
 useEffect(()=>{if(!ready)return;try{localStorage.setItem(key,JSON.stringify(state))}catch{}},[key,state,ready])
 const mutate=(fn:(current:ReadingState)=>ReadingState)=>{if(!ready)return;const scope=key;setState(current=>currentKey.current===scope?fn(current):current)}
 const updateEntry:Value["updateEntry"]=(realm,id,value)=>mutate(current=>({...current,[realm]:{...current[realm],entries:{...current[realm].entries,[id]:{...current[realm].entries[id],...value,updatedAt:new Date().toISOString()}}}}))
 const updateSettings:Value["updateSettings"]=(realm,value)=>mutate(current=>({...current,[realm]:{...current[realm],...value}}))
 const clearHistory:Value["clearHistory"]=(realm)=>mutate(current=>({...current,[realm]:{...current[realm],entries:Object.fromEntries(Object.entries(current[realm].entries).map(([id,entry])=>[id,{saved:entry.saved,downloaded:entry.downloaded}]))}}))
 return <Context.Provider value={{state:ready?state:freshReadingState(),ready,scopeKey:key,updateEntry,updateSettings,clearHistory}}>{children}</Context.Provider>
}
export function useReadingState(){const value=useContext(Context);if(!value)throw Error("ReadingStateProvider is required");return value}
