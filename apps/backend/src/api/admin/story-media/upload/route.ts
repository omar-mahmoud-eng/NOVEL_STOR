import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{randomUUID}from"node:crypto"
import{uploadPrivateMedia}from"../../../../utils/s3-drm"
const allowed:Record<string,string>={"application/pdf":"pdf","application/epub+zip":"epub","audio/mpeg":"mp3","audio/mp4":"m4b","audio/x-m4a":"m4a","audio/wav":"wav"}
export async function POST(req:MedusaRequest,res:MedusaResponse){
 const type=(req.headers["content-type"]||"").split(";")[0],extension=allowed[type];if(!extension)return res.status(400).json({message:"Supported files: PDF, EPUB, MP3, M4B, WAV"})
 const chunks:Buffer[]=[];let size=0;try{for await(const chunk of req){const part=Buffer.from(chunk);size+=part.length;if(size>32*1024*1024)return res.status(413).json({message:"Maximum file size is 32 MB"});chunks.push(part)}if(!size)return res.status(400).json({message:"Empty file"});const body=Buffer.concat(chunks),key=`protected/uploads/${randomUUID()}.${extension}`;await uploadPrivateMedia(key,body,type);return res.status(201).json({key,mime_type:type,file_size_bytes:size})}catch{return res.status(502).json({message:"Private storage upload failed"})}
}
