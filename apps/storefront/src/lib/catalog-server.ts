import "server-only"
import {cache} from "react"
import {connection} from "next/server"
import { backendFetch } from "./medusa-server"
import { getAllBooks, getBookByHandle, type StoryBookData } from "./books-data"
export const getReadingBook=cache(async(handle:string):Promise<StoryBookData|undefined>=>{
  await connection()
  if(!/^[A-Za-z0-9_-]+$/.test(handle))return undefined
  try{const response=await backendFetch(`/store/reading-stories/${encodeURIComponent(handle)}`);if(response.status===404)return undefined;if(!response.ok)throw Error("Reading catalog unavailable");return (await response.json()).book}
  catch(error){if(process.env.READING_CATALOG_REQUIRED==="true")throw error;return getBookByHandle(handle)}
})
export const getFirstOriginalBook=cache(async():Promise<StoryBookData|undefined>=>{
  await connection()
  try{const response=await backendFetch('/store/reading-stories?realm=originals');if(!response.ok)throw Error('Reading catalog unavailable');const books:StoryBookData[]=(await response.json()).books;return books.find(book=>book.handle==='kharaet-al-ramad')||books[0]}
  catch(error){if(process.env.READING_CATALOG_REQUIRED==='true')throw error;return getAllBooks().find(book=>book.ageGroup==='adults_18_plus')}
})
