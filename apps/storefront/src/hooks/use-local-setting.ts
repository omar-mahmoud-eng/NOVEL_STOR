"use client"
import { useEffect, useState } from "react"
export function useLocalSetting<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback), [loadedKey, setLoadedKey] = useState("")
  useEffect(() => {
    const read=()=>{try{const raw=localStorage.getItem(key);const next=raw?JSON.parse(raw):fallback;const valid=fallback===null?next===null||typeof next==="object":Array.isArray(fallback)?Array.isArray(next):typeof next===typeof fallback;setValue(valid?next:fallback)}catch{setValue(fallback)}}
    read();setLoadedKey(key)
    const change=(event:Event)=>{if(event instanceof StorageEvent && event.key!==key)return;if(event instanceof CustomEvent && event.detail?.key!==key)return;read()}
    window.addEventListener("storage",change);window.addEventListener("storyverse.setting",change)
    return()=>{window.removeEventListener("storage",change);window.removeEventListener("storyverse.setting",change)}
  }, [key])
  useEffect(() => { try { if (loadedKey === key) {const serialized=JSON.stringify(value);if(localStorage.getItem(key)!==serialized){localStorage.setItem(key,serialized);window.dispatchEvent(new CustomEvent("storyverse.setting",{detail:{key}}))}} } catch {} }, [key, loadedKey, value])
  return [loadedKey===key?value:fallback, setValue, loadedKey === key] as const
}
