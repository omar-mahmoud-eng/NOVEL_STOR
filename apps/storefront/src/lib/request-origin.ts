export function allowedRequestOrigin(requestUrl:string,origin:string|null,publicBase?:string):boolean{
 if(!origin)return true
 try{const expected=new URL(publicBase||requestUrl);if(origin===expected.origin)return true
  if(expected.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(expected.hostname))return ['localhost','127.0.0.1','[::1]'].some(host=>origin===`http://${host}${expected.port?`:${expected.port}`:''}`)
  return false
 }catch{return false}
}
