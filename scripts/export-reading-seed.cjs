const fs=require("node:fs"),path=require("node:path")
const {loadSource}=require("../tests/source-loader.cjs")
const {PUBLISHING_BOOKS}=loadSource("apps/storefront/src/lib/books-data.ts")
const {bookGenre}=loadSource("apps/storefront/src/lib/book-genre.ts")
const reference=require("../apps/storefront/src/lib/stitch-reading-reference.json")
const nuno=["نَزَلَ المَطَرُ بِهُدُوءٍ.","فَتَحَ نُونُو مِظَلَّتَهُ.","رَأَى عُصْفُورًا عِنْدَ البَابِ.","قَالَ: تَعَالَ نَحْتَمِي مَعًا.","وَقَفَ العُصْفُورُ تَحْتَ المِظَلَّةِ.","ابْتَسَمَ نُونُو، وَانْتَهَتِ الحِكَايَةُ."]
const names=["l03_base_1440","l03_scene_2_390","l03_scene_3_390","l03_scene_4_390","l03_scene_5_390","l03_scene_6_390"]
const data=PUBLISHING_BOOKS.map(book=>({...book,...(book.id==="book_little_01"?{sampleText:nuno,sectionImages:names.map(name=>reference[name].images[0].src)}:{}),genre:bookGenre(book),minutes:book.minutes||10,starterContent:true}))
const destination=path.resolve(__dirname,"../apps/backend/src/data/reading-catalog.ts")
fs.mkdirSync(path.dirname(destination),{recursive:true})
fs.writeFileSync(destination,"// Initial editable content imported from the supplied design. Existing edits are never overwritten.\nexport const starterCatalog = "+JSON.stringify(data,null,2)+"\n")
console.log("Prepared",data.length,"editable starter stories.")
