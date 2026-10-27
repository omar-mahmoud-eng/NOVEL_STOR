"use client"
import Link from "next/link"
import {useCatalogBooks} from "@/context/catalog-context"
import {REALMS,realmBase,type ReadingRealm} from "@/lib/realms"

export function PublishedShelf({realm,locale}:{realm:ReadingRealm;locale:"ar"|"en"}){
 const books=useCatalogBooks().filter(book=>book.ageGroup===REALMS[realm].group),base=realmBase(locale,realm),ar=locale==="ar"
 return <section className="max-w-7xl mx-auto px-4 py-10 space-y-6" data-published-shelf={realm} style={{color:REALMS[realm].ink,background:REALMS[realm].background}}><h2 className="text-2xl font-bold">{ar?"الحكايات المنشورة في هذه المنصة":"Published stories in this realm"}</h2>{books.length?<div className="grid grid-cols-2 md:grid-cols-4 gap-5">{books.map(book=><article key={book.id} className="rounded-2xl border p-3 space-y-3" style={{background:REALMS[realm].surface}}><Link href={`${base}/books/${book.handle}`}><img className="w-full aspect-[3/4] object-cover rounded-xl" src={book.coverUrl} alt={book.title}/><h3 className="font-bold mt-3">{book.title}</h3></Link><p className="text-sm">{book.author.name}</p><Link className="underline" href={`${base}/reader/${book.handle}`}>{ar?"ابدأ القراءة":"Read story"}</Link></article>)}</div>:<p role="status">{ar?"لا توجد حكايات منشورة في هذه المنصة حاليًا.":"No stories are currently published in this realm."}</p>}</section>
}
