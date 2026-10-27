const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const [name,realm,featured] of [['realms/kids-realm-view','kids','book_kids_01'],['realms/teens-realm-view','teens','book_teens_01'],['realms/little-realm-view','little','book_little_01'],['home/publishing-home-view','originals','kharaet-al-ramad']]){
 const p=path.join(root,'apps/storefront/src/components/'+name+'.tsx');let s=fs.readFileSync(p,'utf8');
 s=s.replace('"use client"','"use client"\nimport {PublishedShelf} from "@/components/realms/published-shelf"');
 if(!s.includes('import { useCatalogBooks }'))s=s.replace('"use client"','"use client"\nimport { useCatalogBooks } from "@/context/catalog-context"');
 s=s.replace('  const isRtl = locale === "ar"',`  const publishedBooks = useCatalogBooks()\n  const isRtl = locale === "ar"`);
 s=s.replace('featured.sampleText.length','(featured?.sampleText.length || 1)');
 const index=s.indexOf('  return (');s=s.slice(0,index)+`  if (!publishedBooks.some(book=>book.id==="${featured}")) return <PublishedShelf realm="${realm}" locale={locale}/>\n`+s.slice(index);
 // Insert the live shelf before the preserved Stitch layout.
 s=s.replace(/(  return \(\s*<div[^>]*>)/,`$1\n      <PublishedShelf realm="${realm}" locale={locale}/>`);
 fs.writeFileSync(p,s);
}
const p=path.join(root,'apps/storefront/src/components/realms/realm-experience.tsx');let s=fs.readFileSync(p,'utf8');
s=s.replace('export function RealmExperience({ realm, screen, book: supplied, locale, query = "", initialPage, category="all" }: Props) {',`export function RealmExperience(props:Props) {
 const books=useCatalogBooks().filter(book=>book.ageGroup===REALMS[props.realm].group)
 if(!props.book&&!books.length)return <div className="realm-width py-12 space-y-6"><h1>{props.locale==="ar"?"لا توجد حكايات منشورة في هذه المنصة حاليًا.":"No stories are currently published in this realm."}</h1><Link href={realmBase(props.locale,props.realm)}>{props.locale==="ar"?"الرئيسية":"Home"}</Link></div>
 return <RealmExperienceContent {...props}/>
}
function RealmExperienceContent({ realm, screen, book: supplied, locale, query = "", initialPage, category="all" }: Props) {`);
// Published sections, including edits to the starter stories, are authoritative.
s=s.replace('if(book.id==="book_kids_01" && screen==="illustrated")','if(book.id==="book_kids_01" && screen==="illustrated" && !book.sectionImages)');
s=s.replace('    const html = `<!doctype','    const title = book.title.replace(/[&<>"\']/g, character=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\\"":"&quot;","\'":"&#39;"}[character] || character))\n    const html = `<!doctype').replaceAll('${book.title}','${title}');
fs.writeFileSync(p,s);
