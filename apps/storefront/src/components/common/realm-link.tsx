"use client"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { realmFromPath, scopedHref } from "@/lib/realms"
import {useCatalog} from "@/context/catalog-context"

export default function RealmLink(props: ComponentProps<typeof NextLink>) {
  const realm = realmFromPath(usePathname() || "")
  const catalog=useCatalog()
  const href = typeof props.href === "string" ? scopedHref(props.href, realm) : props.href
  const story=typeof href==="string"?href.match(/^\/(ar|en)(?:\/realms\/(?:little|kids|teens))?\/(?:books|reader|player)\/([^/?#]+)/):null
  if(story&&!catalog.loading&&!catalog.error&&!catalog.books.some(book=>book.id===story[2]||book.handle===story[2]))return <span className={props.className} aria-disabled="true">{story[1]==="ar"?"القصة غير متاحة حاليًا":"Story currently unavailable"}</span>
  return <NextLink {...props} href={href} prefetch={story?false:props.prefetch} />
}
