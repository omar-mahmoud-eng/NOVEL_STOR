"use client"
import { useCatalog } from "@/context/catalog-context"
export function CatalogNotice(){const {error,refresh}=useCatalog();return error?<aside role="status" className="flex flex-wrap gap-3 items-center justify-center p-3 bg-amber-50 text-amber-950 text-sm"><span>{error}</span><button className="underline font-bold" onClick={refresh}>إعادة الاتصال</button></aside>:null}
