export const READING_REALMS=["originals","little","kids","teens"] as const
export type ReadingRealmId=typeof READING_REALMS[number]
export type ReadingEntry={saved?:boolean;page?:number;furthest?:number;completed?:boolean;updatedAt?:string;notes?:string;branch?:string[];downloaded?:boolean;_fieldClocks?:Record<string,string>;_resetAt?:string}
export type RealmReadingState={entries:Record<string,ReadingEntry>;level:number;theme:string;fontSize:number;fontFamily:string;quiet:boolean;speed:number;_settingsClocks?:Record<string,string>;_historyResetAt?:string}
export type ReadingState=Record<ReadingRealmId,RealmReadingState>
const entryFields=["saved","page","furthest","completed","notes","branch"] as const
const historyFields=new Set<string>(["page","furthest","completed","notes","branch"])
const settingFields=["level","theme","fontSize","fontFamily","quiet","speed"] as const
export function freshReadingState():ReadingState{const realm=():RealmReadingState=>({entries:{},level:2,theme:"paper",fontSize:22,fontFamily:"serif",quiet:false,speed:1});return{originals:realm(),little:realm(),kids:realm(),teens:realm()}}
function validClock(value:unknown):value is string{return typeof value==="string"&&value.length<=150&&Number.isFinite(Date.parse(value.split("|")[0]))}
function clockMap(input:any,fields:readonly string[]){const result:Record<string,string>={};if(input&&typeof input==="object")for(const field of fields)if(validClock(input[field]))result[field]=input[field];return result}
export function sanitizeReadingState(input:unknown):ReadingState{
 const next=freshReadingState();if(!input||typeof input!=="object")return next
 for(const realm of READING_REALMS){const value=(input as any)[realm];if(!value||typeof value!=="object")continue;const target=next[realm]
  target.fontSize=Math.max(16,Math.min(32,Number(value.fontSize)||22));target.level=[1,2,3].includes(value.level)?value.level:2;target.speed=[0.75,1,1.25,1.5].includes(value.speed)?value.speed:1;target.theme=["paper","night","ivory","contrast"].includes(value.theme)?value.theme:"paper";target.fontFamily=["serif","sans","ruqah"].includes(value.fontFamily)?value.fontFamily:"serif";target.quiet=value.quiet===true;target._settingsClocks=clockMap(value._settingsClocks,settingFields)
  if(validClock(value._historyResetAt))target._historyResetAt=value._historyResetAt
  if(value.entries&&typeof value.entries==="object"&&!Array.isArray(value.entries))for(const[id,raw]of Object.entries(value.entries).slice(0,2000)){if(!raw||typeof raw!=="object"||id.length>160||["__proto__","constructor","prototype"].includes(id))continue;const entry=raw as any
   target.entries[id]={...(Object.prototype.hasOwnProperty.call(entry,"saved")?{saved:entry.saved===true}:{}),...(Object.prototype.hasOwnProperty.call(entry,"completed")?{completed:entry.completed===true}:{}),...(Object.prototype.hasOwnProperty.call(entry,"downloaded")?{downloaded:entry.downloaded===true}:{}),...(Number.isInteger(entry.page)&&entry.page>=0?{page:Math.min(10000,entry.page)}:{}),...(Number.isInteger(entry.furthest)&&entry.furthest>=0?{furthest:Math.min(10000,entry.furthest)}:{}),...(typeof entry.notes==="string"?{notes:entry.notes.slice(0,100000)}:{}),...(typeof entry.updatedAt==="string"&&Number.isFinite(Date.parse(entry.updatedAt))?{updatedAt:entry.updatedAt}:{}),...(Array.isArray(entry.branch)?{branch:entry.branch.filter((item:unknown)=>typeof item==="string").slice(0,100)}:{}),_fieldClocks:clockMap(entry._fieldClocks,entryFields),...(validClock(entry._resetAt)?{_resetAt:entry._resetAt}:{})}
   if(!Object.prototype.hasOwnProperty.call(entry,"_fieldClocks")&&entry.updatedAt)for(const field of entryFields)if(Object.prototype.hasOwnProperty.call(entry,field))target.entries[id]._fieldClocks![field]=entry.updatedAt
  }
 }return next
}
export function readingScopeKey(accountId?:string,profileId?:string){return`storyverse.reading.v1.${accountId||"guest"}${profileId?`.profile.${profileId}`:""}`}
export function hasReadingHistory(entry?:ReadingEntry){return Boolean(entry&&(entry.page!==undefined||entry.completed||entry.notes?.trim()||entry.branch?.length))}
function normalizeClock(value:string|undefined,now:number){if(!value)return"";const[date,device=""]=value.split("|");const time=Date.parse(date);return Number.isFinite(time)?new Date(Math.min(time,now+300000)).toISOString()+"|"+device.slice(0,80):""}
export function stripDeviceReadingState(input:unknown){const state=sanitizeReadingState(input);for(const realm of READING_REALMS)for(const entry of Object.values(state[realm].entries))delete entry.downloaded;return state}
export function stampInitialReadingState(input:unknown,stamp:string){const state=stripDeviceReadingState(input);for(const realm of READING_REALMS){const section=state[realm];for(const field of settingFields)section._settingsClocks![field] ||= stamp;for(const entry of Object.values(section.entries))for(const field of entryFields)if(Object.prototype.hasOwnProperty.call(entry,field))entry._fieldClocks![field] ||= entry.updatedAt||stamp}return state}
export function mergeReadingStates(serverInput:unknown,incomingInput:unknown,options:{now?:number;preserveDownloads?:boolean}={}):ReadingState{
 const server=sanitizeReadingState(serverInput),incoming=sanitizeReadingState(incomingInput),now=options.now??Date.now(),result=freshReadingState()
 for(const realm of READING_REALMS){const a=server[realm],b=incoming[realm],target=result[realm];target._settingsClocks={}
  const realmReset=[normalizeClock(a._historyResetAt,now),normalizeClock(b._historyResetAt,now)].sort().pop()||"";if(realmReset)target._historyResetAt=realmReset
  for(const field of settingFields){const ca=normalizeClock(a._settingsClocks?.[field],now),cb=normalizeClock(b._settingsClocks?.[field],now),take=cb>ca||(cb===ca&&JSON.stringify(b[field])>JSON.stringify(a[field]));(target as any)[field]=(take?b:a)[field];target._settingsClocks[field]=take?cb:ca}
  for(const id of new Set([...Object.keys(a.entries),...Object.keys(b.entries)])){
   const left=a.entries[id]||{},right=b.entries[id]||{},entry:ReadingEntry={_fieldClocks:{}},reset=[realmReset,normalizeClock(left._resetAt,now),normalizeClock(right._resetAt,now)].sort().pop()||""
   if(reset)entry._resetAt=reset
   for(const field of entryFields){let ca=normalizeClock(left._fieldClocks?.[field],now),cb=normalizeClock(right._fieldClocks?.[field],now)
    const leftCleared=historyFields.has(field)&&Boolean(reset)&&ca<=reset,rightCleared=historyFields.has(field)&&Boolean(reset)&&cb<=reset
    if(leftCleared)ca=reset;if(rightCleared)cb=reset
    let takeRight=cb>ca;if(cb===ca){const hasLeft=Object.prototype.hasOwnProperty.call(left,field),hasRight=Object.prototype.hasOwnProperty.call(right,field);if(!ca&&!hasLeft&&hasRight&&!reset)takeRight=true;else if(ca&&!hasRight&&right._fieldClocks?.[field])takeRight=true;else if(hasLeft&&hasRight&&!leftCleared&&!rightCleared)takeRight=JSON.stringify((right as any)[field])>JSON.stringify((left as any)[field])}
    const source=takeRight?right:left,cleared=takeRight?rightCleared:leftCleared,chosen=takeRight?cb:ca
    if(!cleared&&Object.prototype.hasOwnProperty.call(source,field))(entry as any)[field]=(source as any)[field]
    if(chosen)entry._fieldClocks![field]=chosen
    if(field==="furthest"&&!leftCleared&&!rightCleared&&left.furthest!==undefined&&right.furthest!==undefined)entry.furthest=Math.max(left.furthest,right.furthest)
   }
   const latest=Object.values(entry._fieldClocks!).sort().pop();if(latest)entry.updatedAt=latest.split("|")[0]
   if(options.preserveDownloads&&right.downloaded!==undefined)entry.downloaded=right.downloaded
   target.entries[id]=entry
  }
 }return result
}
